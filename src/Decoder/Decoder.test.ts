import MadMessageDecoder, { DECODER_ERRORS } from "."

const HELLO_WORLD = 'ZjcwZWVjYTUtZjVhZS00ZDllLWFmNjktYWExNmYyNWY4NjRjICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMTcweyJoZWxsbyI6IndvcmxkIn0=';

const GZIP_HELLO_WORLD = 'ZGNmZDA0ZWEtYTkwNS00NTI5LWEwNGUtMDJjNzg5MDMxMzdkICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMzdnH4sIAAAAAAAAA6tWykjNyclXslIqzy/KSVGqBQDRQQnYEQAAAA=='

const DEFLATE_HELLO_WORLD = 'NTM4MTMyYzctNDAxZS00ZjFjLWFjZWItY2FkMjZjNjBiNjNkICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMjVpeJyrVspIzcnJV7JSKs8vyklRqgUANWsF9w=='

const BROTLI_HELLO_WORLD = 'YzJlODdjNTctMTBmNC00MmVjLTgwN2EtYzI0N2FkYzg0ZTgxICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMjFiCwiAeyJoZWxsbyI6IndvcmxkIn0D'

const DEFLATE_BINARY_HELLO_WORLD = 'MDA0Nzc5MzYtMGZjMC00N2E4LTkwOWEtM2NkZDI1MWFiNzFkICAgICAgICAgMDFiICAgICAgICAgICAgICAgICAgMTlpeJzzSM3JyQ/PL8pJUQQAGXQEHg=='

const sleep = (ms: number) => {
    return new Promise((resolve) =>
        setTimeout(resolve, ms)
    )
}

describe("Decoder lifecycle", () => {
    it("spawns a decoder instance", () => {
        const spy = jest.fn()
        const decoder = new MadMessageDecoder(Buffer.from("hello world"), spy, false);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(new Error(DECODER_ERRORS.WRONG_MESSAGE_FORMAT), decoder)
        expect(decoder.get_attr('id')).toBeUndefined();
        expect(decoder.get_attr('type')).toBeUndefined();
        expect(decoder.get_attr('content')).toBeUndefined();
        expect(decoder.get_attr('finalize')).toBeFalsy();
        expect(decoder.get_attr('isResponse')).toBeTruthy();
        expect(decoder.get_attr('num')).toEqual(0);
        expect(decoder.get_attr('length')).toEqual(0);
        expect(decoder.get_attr('transferredLength')).toEqual(0);
        expect(decoder.get_attr('zip')).toEqual("0");
    })

    it("decodes hello world json message", () => {
        const spy = jest.fn()
        const decoder = new MadMessageDecoder(Buffer.from(HELLO_WORLD, 'base64'), spy, false);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, decoder);
        expect(decoder.content).toBeDefined();
        expect(typeof decoder.content).toEqual("object")
        expect(decoder.content.hello).toEqual("world")

    })

    it("decodes hello world json gzipped message", async () => {
        const spy = jest.fn()
        const decoder = new MadMessageDecoder(Buffer.from(GZIP_HELLO_WORLD, 'base64'), spy, false);
        await sleep(1000)
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, decoder);
        expect(decoder.content).toBeDefined();
        expect(typeof decoder.content).toEqual("object")
        expect(decoder.content.hello).toEqual("world")
    })

    it("decodes hello world json deflated message", async () => {
        const spy = jest.fn()
        const decoder = new MadMessageDecoder(Buffer.from(DEFLATE_HELLO_WORLD, 'base64'), spy, false);
        await sleep(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, decoder);
        expect(decoder.content).toBeDefined();
        expect(typeof decoder.content).toEqual("object")
        expect(decoder.content.hello).toEqual("world")
    })

    it("decodes binary deflated message", async () => {
        const spy = jest.fn()
        const decoder = new MadMessageDecoder(Buffer.from(DEFLATE_BINARY_HELLO_WORLD, 'base64'), spy, false);
        await sleep(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, decoder);
        expect(decoder.content).toBeDefined();
        expect(decoder.content instanceof Buffer).toBeTruthy()
        expect(decoder.content.toString("utf-8")).toEqual("HelloWorld!")
    })

    it("decodes hello world json brotli message", async () => {
        const spy = jest.fn()
        const decoder = new MadMessageDecoder(Buffer.from(BROTLI_HELLO_WORLD, 'base64'), spy, true);
        await sleep(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, decoder);
        expect(decoder.content).toBeDefined();
        expect(typeof decoder.content).toEqual("object")
        expect(decoder.content.hello).toEqual("world")
    })

    it("fails due to decompression error", async () => {
        const spy = jest.fn()
        const decoder = new MadMessageDecoder(Buffer.from(BROTLI_HELLO_WORLD, 'base64'), spy, true);
        await sleep(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, decoder);
        spy.mockClear();
        decoder.unzip_cmd = jest.fn(() => (content, cb) => {
            cb(new Error("Emulated zip error"), Buffer.from(""));
        });
        decoder.read(Buffer.from(BROTLI_HELLO_WORLD, 'base64'), spy)
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(new Error(DECODER_ERRORS.ZIP_DECOMPRESSION_ERROR), decoder);
    })

})