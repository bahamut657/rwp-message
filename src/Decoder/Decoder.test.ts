import MadMessageDecoder, { DECODER_ERRORS, DecodedMessage } from "."

const HELLO_WORLD = 'ZjcwZWVjYTUtZjVhZS00ZDllLWFmNjktYWExNmYyNWY4NjRjICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMTcweyJoZWxsbyI6IndvcmxkIn0=';

const GZIP_HELLO_WORLD = 'ZGNmZDA0ZWEtYTkwNS00NTI5LWEwNGUtMDJjNzg5MDMxMzdkICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMzdnH4sIAAAAAAAAA6tWykjNyclXslIqzy/KSVGqBQDRQQnYEQAAAA=='

const DEFLATE_HELLO_WORLD = 'NTM4MTMyYzctNDAxZS00ZjFjLWFjZWItY2FkMjZjNjBiNjNkICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMjVpeJyrVspIzcnJV7JSKs8vyklRqgUANWsF9w=='

const BROTLI_HELLO_WORLD = 'YzJlODdjNTctMTBmNC00MmVjLTgwN2EtYzI0N2FkYzg0ZTgxICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMjFiCwiAeyJoZWxsbyI6IndvcmxkIn0D'

const DEFLATE_BINARY_HELLO_WORLD = 'MDA0Nzc5MzYtMGZjMC00N2E4LTkwOWEtM2NkZDI1MWFiNzFkICAgICAgICAgMDFiICAgICAgICAgICAgICAgICAgMTlpeJzzSM3JyQ/PL8pJUQQAGXQEHg=='

describe("Decoder lifecycle", () => {
    it("spawns a decoder instance", (done) => {
        const spy = jest.fn((e: Error | null, decodedMessage?: DecodedMessage) => {
            expect(e instanceof Error).toBeTruthy();
            if (e) {
                expect(e.message).toEqual(DECODER_ERRORS.WRONG_MESSAGE_FORMAT)
            }
            expect(decodedMessage).toBeUndefined();
            done()
        })
        const decoder = new MadMessageDecoder(false);
        decoder.read(Buffer.from("hello world"), spy)

    })

    it("decodes hello world json message", (done) => {
        const spy = jest.fn((e: Error | null, decodedMessage?: DecodedMessage) => {
            expect(e === null).toBeTruthy();
            expect(decodedMessage).toBeDefined();
            if (decodedMessage) {
                expect(decodedMessage.content).toBeDefined();
                expect(typeof decodedMessage.content).toEqual("object")
                expect(decodedMessage.content.hello).toEqual("world")
            }
            done()
        })
        const decoder = new MadMessageDecoder(false);
        decoder.read(Buffer.from(HELLO_WORLD, 'base64'), spy)

    })


    it("decodes hello world json gzipped message", (done) => {
        const spy = jest.fn((e: Error | null, decodedMessage?: DecodedMessage) => {
            expect(e === null).toBeTruthy();
            expect(decodedMessage).toBeDefined();
            if (decodedMessage) {
                expect(decodedMessage.content).toBeDefined();
                expect(typeof decodedMessage.content).toEqual("object")
                expect(decodedMessage.content.hello).toEqual("world")
            }
            done()
        })
        const decoder = new MadMessageDecoder(false);
        decoder.read(Buffer.from(GZIP_HELLO_WORLD, 'base64'), spy)
    })


    it("decodes hello world json deflated message", (done) => {
        const spy = jest.fn((e: Error | null, decodedMessage?: DecodedMessage) => {
            expect(e === null).toBeTruthy();
            expect(decodedMessage).toBeDefined();
            if (decodedMessage) {
                expect(decodedMessage.content).toBeDefined();
                expect(typeof decodedMessage.content).toEqual("object")
                expect(decodedMessage.content.hello).toEqual("world")
            }
            done()
        })
        const decoder = new MadMessageDecoder(false);
        decoder.read(Buffer.from(DEFLATE_HELLO_WORLD, 'base64'), spy)
    })

    it("decodes binary deflated message", (done) => {
        const spy = jest.fn((e: Error | null, decodedMessage?: DecodedMessage) => {
            expect(e === null).toBeTruthy();
            expect(decodedMessage).toBeDefined();
            if (decodedMessage) {
                expect(decodedMessage.content).toBeDefined();
                expect(decodedMessage.content instanceof Buffer).toBeTruthy()
                expect(decodedMessage.content.toString("utf-8")).toEqual("HelloWorld!")
            }
            done()
        })
        const decoder = new MadMessageDecoder(false);
        decoder.read(Buffer.from(DEFLATE_BINARY_HELLO_WORLD, 'base64'), spy)
    })

    it("decodes hello world json brotli message", (done) => {
        const spy = jest.fn((e: Error | null, decodedMessage?: DecodedMessage) => {
            expect(e === null).toBeTruthy();
            expect(decodedMessage).toBeDefined();
            if (decodedMessage) {
                expect(decodedMessage.content).toBeDefined();
                expect(typeof decodedMessage.content).toEqual("object")
                expect(decodedMessage.content.hello).toEqual("world")
            }
            done()
        })
        const decoder = new MadMessageDecoder(true);
        decoder.read(Buffer.from(BROTLI_HELLO_WORLD, 'base64'), spy)
    })

    it("fails due to decompression error", (done) => {
        const spy = jest.fn((e: Error | null, decodedMessage?: DecodedMessage) => {
            expect(e instanceof Error).toBeTruthy();
            if (e) {
                expect(e.message).toEqual(DECODER_ERRORS.ZIP_DECOMPRESSION_ERROR)
            }
            done()
        })
        const decoder = new MadMessageDecoder(true);
        decoder.unzip_cmd = jest.fn(() => (content, cb) => {
            cb(new Error("Emulated zip error"), Buffer.from(""));
        });

        decoder.read(Buffer.from(BROTLI_HELLO_WORLD, 'base64'), spy)

    })

})