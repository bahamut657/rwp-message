import { MadMessageCompressionName, MadMessageType, ZlibMethod } from "../types"
import { v4 as uuidv4 } from "uuid"
import zlib from "node:zlib"

type PlainMessage = {
    type?: MadMessageType;
    content: any;
    requestId?: string;
    num?: number;
    finalize?: boolean
    zip?: MadMessageCompressionName;

}

type EncoderCallback = (error: Error | null, message?: EncodedMessage) => void

type BufferMessage = {
    content: Buffer;
    requestId: string;
    num?: string;
    finalize: string;
    type: MadMessageType;
    zip?: MadMessageCompressionName;
}

export type EncodedMessage = {
    isResponse: boolean;
    length: number;
    id: string;
    buffer: Buffer;
}

export const ENCODER_ERRORS = {
    WRONG_MESSAGE_CONTENT: "wrong message content",
    ZIP_COMPRESS_ERROR: "zip compression failed"

}

class MadMessageEncoder {

    // /** message id */
    // id?: string;
    // /** if true, build a response message */
    // isResponse: boolean
    // /** message length */
    // length: number
    // /** message requestId */
    // requestId?: string
    // /** encoded buffer */
    // buffer?: Buffer
    /** debug mode */
    debug: boolean;
    /** input message */
    // input: PlainMessage;
    // /** encoder callback */
    // cb: EncoderCallback;

    constructor(
        // {
        //     type = 'j',
        //     content,
        //     requestId,
        //     num = 0,
        //     finalize = true,
        //     zip = ""
        // }: PlainMessage,
        // cb: EncoderCallback,
        debug = false
    ) {
        //     this.id = requestId ?? uuidv4()
        //     this.input = { type, content, requestId, num, finalize, zip };
        //     this.isResponse = false
        //     this.length = 0
        //     this.buffer;
        this.debug = debug
        // this.cb = cb
        // this.build()
    }

    build(msg: PlainMessage, cb: EncoderCallback) {
        const { requestId = uuidv4(), type = 'j', num = 0, content = null, finalize, zip } = msg
        const bRequestId = ('                                    ' + requestId).slice(-36)
        const bNum = ('          ' + num.toString()).slice(-10)
        const bFinalize = finalize ? '1' : '0'
        const bType = type
        if (['j', 'm'].includes(type)) {
            if (content && typeof content !== 'object') {
                this.build_error(new Error(ENCODER_ERRORS.WRONG_MESSAGE_CONTENT), cb);
                return
            }
        }
        const bContent = ['j', 'm'].includes(type)
            ? Buffer.from(JSON.stringify(content))
            : Buffer.from(content || '')
        const output: EncodedMessage = {
            id: requestId,
            isResponse: false,
            length: 0,
            buffer: Buffer.from('')
        }
        // this.id = uid
        const bMessage: BufferMessage = {
            content: bContent,
            requestId: bRequestId,
            num: bNum,
            finalize: bFinalize,
            type: bType,
            zip
        }
        if (!zip) {
            this.build_uncompressed(bMessage, output, cb)
        } else {
            this.build_zip(zip, bMessage, output, cb)
        }
    }

    build_uncompressed(props: BufferMessage, output: EncodedMessage, cb: EncoderCallback) {
        const { content, requestId, num = 0, finalize, type = 'j' } = props
        const contentLength = content.length
        const reqLength = ('                    ' + contentLength.toString()).slice(-20)
        output.length = contentLength
        output.buffer = Buffer.concat([
            Buffer.from(requestId),
            Buffer.from(num.toString()),
            Buffer.from(finalize),
            Buffer.from(type),
            Buffer.from(reqLength),
            Buffer.from('0'),
            content
        ])
        this.build_done(output, cb)
    }

    build_zip(zip: MadMessageCompressionName, props: BufferMessage, output: EncodedMessage, cb: EncoderCallback) {
        const { content, requestId, num = 0, finalize, type = 'j' } = props

        const zipCmd = this.zip_cmd(zip)


        let totalTime: number = 0;
        if (this.debug) {
            totalTime = Date.now()
        }

        zipCmd(content, (e, zipContent) => {
            if (e) {
                console.log(e);
                this.build_error(new Error(ENCODER_ERRORS.ZIP_COMPRESS_ERROR), cb)
            } else {
                const zipLength = zipContent.length
                const zipReqLength = ('                    ' + zipLength.toString()).slice(-20)
                output.length = zipLength
                output.buffer = Buffer.concat([
                    Buffer.from(requestId),
                    Buffer.from(num.toString()),
                    Buffer.from(finalize),
                    Buffer.from(type),
                    Buffer.from(zipReqLength),
                    Buffer.from(zip.slice(0, 1)),
                    zipContent
                ])
                if (this.debug) {
                    totalTime = Date.now() - totalTime
                    console.log(`[Encoder] ${zip} total encoding time: ${totalTime}ms`)
                }
                this.build_done(output, cb)
            }
        })
    }

    toArrayBuffer(buf: Buffer) {
        const ab = new ArrayBuffer(buf.length)
        const view = new Uint8Array(ab)
        for (let i = 0; i < buf.length; ++i) {
            view[i] = buf[i]
        }
        return ab
    }

    zip_cmd(zip: MadMessageCompressionName): ZlibMethod {
        switch (zip) {
            case 'inflate':
                return zlib.deflate
            case 'brotli':
                return zlib.brotliCompress
            default:
                return zlib.gzip
        }
    }

    build_done(output: EncodedMessage, cb: EncoderCallback) {
        cb(null, output)
    }

    build_error(e: Error, cb: EncoderCallback) {
        cb(e)
    }
}

export default MadMessageEncoder
