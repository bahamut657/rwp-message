import zlib from "node:zlib"
import { ZlibMethod, type MadMessageCompression, type MadMessageType } from '../types'

type DecoderCallback = (error: Error | null, message: MadMessageDecoder) => void

export const DECODER_ERRORS = {
  WRONG_MESSAGE_FORMAT: "wrong message format",
  ZIP_DECOMPRESSION_ERROR: "zip decompression failed"

}

class MadMessageDecoder {
  /** message id */
  id?: string
  /** message type */
  type?: MadMessageType
  /** message content (buffer or json) */
  content: any
  /** if true, the message is finished */
  finalize: boolean
  /** if true, is a response message */
  isResponse: boolean
  /** message packet number */
  num: number
  /** message length */
  length: number
  /** message transferred size */
  transferredLength: number
  /** compression mode */
  zip: MadMessageCompression
  /** debug mode */
  debug: boolean

  constructor(bMessage: Buffer, cb: DecoderCallback, debug: boolean) {
    this.id = undefined
    this.type = undefined
    this.content = undefined
    this.finalize = false
    this.isResponse = true
    this.num = 0

    this.length = 0
    this.transferredLength = 0
    this.zip = '0'
    this.debug = debug
    this.read(bMessage, cb)
  }

  get_attr(attrName: keyof MadMessageDecoder) {
    return this[attrName];
  }

  read(bMessage: Buffer, cb: DecoderCallback): void {
    if (bMessage.length < 69) {
      this.read_error(new Error(DECODER_ERRORS.WRONG_MESSAGE_FORMAT), cb)
      return
    }
    const reqId = bMessage.subarray(0, 36).toString().trim()
    const reqNum = bMessage.subarray(36, 46).toString().trim()
    const reqFinalize = bMessage.subarray(46, 47).toString().trim()
    const reqType = bMessage.subarray(47, 48).toString().trim() as MadMessageType
    const reqLength = parseInt(bMessage.subarray(48, 68).toString().trim(), 10)
    const reqCompression = bMessage.subarray(68, 69).toString().trim() as MadMessageCompression
    this.id = reqId
    this.num = parseInt(reqNum, 10)
    this.type = reqType
    this.length = this.transferredLength = reqLength
    this.zip = reqCompression
    this.finalize = parseInt(reqFinalize, 10) === 1
    switch (this.compression_supported(reqCompression)) {
      case false:
        this.read_uncompressed({ bMessage, reqType, reqLength }, cb)
        break
      default:
        this.read_unzip(reqCompression, { bMessage, reqType, reqLength }, cb)
    }
  }

  read_content(type: MadMessageType, buf: Buffer) {
    return ['j', 'm'].includes(type)
      ? JSON.parse(buf.toString('utf-8'))
      : buf;
  }

  read_uncompressed(props: {
    bMessage: Buffer,
    reqType: MadMessageType,
    reqLength: number
  }, cb: DecoderCallback) {
    const { bMessage, reqType, reqLength } = props
    this.content = this.read_content(reqType, bMessage.subarray(69, reqLength + 69))
    this.read_done(cb)
  }

  read_unzip(zip: MadMessageCompression, props: {
    bMessage: Buffer,
    reqType: MadMessageType,
    reqLength: number
  }, cb: DecoderCallback) {
    const { bMessage, reqType, reqLength } = props
    const zipContent = bMessage.subarray(69, reqLength + 69)
    const unzipCmd = this.unzip_cmd(zip)

    let totalTime: number = 0;
    if (this.debug) {
      totalTime = Date.now()
    }

    unzipCmd(zipContent, (e, plainContent) => {
      if (e) {
        this.read_error(new Error(DECODER_ERRORS.ZIP_DECOMPRESSION_ERROR), cb)
      } else {
        this.length = plainContent.length
        this.content = this.read_content(reqType, plainContent)
        if (this.debug) {
          totalTime = Date.now() - totalTime
          console.log(`[Decoder] ${this.zip} total decoding time: ${totalTime} ms`)
        }
        this.read_done(cb)
      }
    })
  }

  read_done(cb: DecoderCallback): void {
    cb(null, this)
  }

  read_error(e: Error, cb: DecoderCallback): void {
    cb(e, this)
  }

  unzip_cmd(zip: MadMessageCompression): ZlibMethod {
    switch (zip) {
      case 'i':
        return zlib.inflate
      case 'b':
        return zlib.brotliDecompress;
      default: //g
        return zlib.gunzip
    }
  }

  compression_supported(compression: MadMessageCompression) {
    return ['g', 'i', 'b'].includes(compression)
  }
}

export default MadMessageDecoder
