import zlib from "node:zlib"
import { ZlibMethod, type MadMessageCompression, type MadMessageType } from '../types'
import { decode } from "node:punycode";

export type DecodedMessage = {
  id: string;
  type: MadMessageType;
  content: any;
  finalize: boolean;
  isResponse?: boolean;
  num: number;
  length: number;
  transferredLength: number;
  zip: MadMessageCompression;
}

type DecoderCallback = (error: Error | null, message?: DecodedMessage) => void

export const DECODER_ERRORS = {
  WRONG_MESSAGE_FORMAT: "wrong message format",
  ZIP_DECOMPRESSION_ERROR: "zip decompression failed"

}

class MadMessageDecoder {
  /** debug mode */
  debug: boolean

  constructor(debug: boolean) {
    this.debug = debug
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
    const decodedMessage: DecodedMessage = {
      id: reqId,
      num: parseInt(reqNum, 10),
      type: reqType,
      length: reqLength,
      transferredLength: reqLength,
      zip: reqCompression,
      finalize: parseInt(reqFinalize, 10) === 1,
      content: null
    }
    switch (this.compression_supported(reqCompression)) {
      case false:
        this.read_uncompressed({ bMessage, reqType, reqLength }, decodedMessage, cb)
        break
      default:
        this.read_unzip(reqCompression, { bMessage, reqType, reqLength }, decodedMessage, cb)
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
  },
    decodedMessage: DecodedMessage,
    cb: DecoderCallback) {
    const { bMessage, reqType, reqLength } = props
    decodedMessage.content = this.read_content(reqType, bMessage.subarray(69, reqLength + 69))
    this.read_done(cb, decodedMessage)
  }

  read_unzip(
    zip: MadMessageCompression,
    props: {
      bMessage: Buffer,
      reqType: MadMessageType,
      reqLength: number
    },
    decodedMessage: DecodedMessage,
    cb: DecoderCallback) {
    const { bMessage, reqType, reqLength } = props
    const zipContent = bMessage.subarray(69, reqLength + 69)
    const unzipCmd = this.unzip_cmd(zip)

    let totalTime: number = 0;
    if (this.debug) {
      totalTime = Date.now()
    }

    unzipCmd(zipContent, (e, plainContent) => {
      if (e) {
        this.read_error(new Error(DECODER_ERRORS.ZIP_DECOMPRESSION_ERROR), cb, decodedMessage)
      } else {
        decodedMessage.length = plainContent.length;
        decodedMessage.content = this.read_content(reqType, plainContent);
        if (this.debug) {
          totalTime = Date.now() - totalTime
          console.log(`[Decoder] ${decodedMessage.zip} total decoding time: ${totalTime} ms`)
        }
        this.read_done(cb, decodedMessage)
      }
    })
  }

  read_done(cb: DecoderCallback, decodedMessage: DecodedMessage): void {
    cb(null, decodedMessage)
  }

  read_error(
    e: Error,
    cb: DecoderCallback,
    decodedMessage?: DecodedMessage
  ): void {
    cb(e, decodedMessage)
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
