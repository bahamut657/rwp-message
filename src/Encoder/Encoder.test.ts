import Encoder, { ENCODER_ERRORS } from "."

const sleep = (ms: number) => {
    return new Promise((resolve) =>
        setTimeout(resolve, ms)
    )
}

describe("Encoder lifecycle and props", () => {
    it("spawns an encoder", () => {
        const spy = jest.fn();
        const enc = new Encoder({
            content: { hello: "world" },
        }, spy)
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, enc);
        expect(enc.buffer).toBeDefined();
        if (enc.buffer) {
            expect(enc.buffer.length).toBeGreaterThan(0);
        }
    })

    it("spawns a gzip encoder", async () => {
        const spy = jest.fn();
        const enc = new Encoder({
            content: { hello: "world" },
            zip: "gzip"
        }, spy)
        await sleep(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, enc);
        expect(enc.buffer).toBeDefined();
        if (enc.buffer) {
            expect(enc.buffer.length).toBeGreaterThan(0);
        }
    })

    it("spawns an inflate encoder and finalize=false", async () => {
        const spy = jest.fn();
        const enc = new Encoder({
            requestId: "emulated-uid",
            content: { hello: "world" },
            zip: "inflate",
            finalize: false
        }, spy)
        expect(enc.id).toEqual("emulated-uid")
        await sleep(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, enc);
        expect(enc.buffer).toBeDefined();
        if (enc.buffer) {
            expect(enc.buffer.length).toBeGreaterThan(0);
        }
    })

    it("spawns an inflate encoder with a binary message", async () => {
        const spy = jest.fn();
        const enc = new Encoder({
            type: "b",
            content: Buffer.from("HelloWorld!"),
            zip: "inflate",
            finalize: true
        }, spy)
        await sleep(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, enc);
        expect(enc.buffer).toBeDefined();
        if (enc.buffer) {
            expect(enc.buffer.length).toBeGreaterThan(0);
        }
    })

    it("spawns an inflate encoder with a binary null message", async () => {
        const spy = jest.fn();
        const enc = new Encoder({
            type: "b",
            content: null,
            zip: "inflate",
            finalize: true
        }, spy)
        await sleep(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, enc);
        expect(enc.buffer).toBeDefined();
        if (enc.buffer) {
            expect(enc.buffer.length).toBeGreaterThan(0);
        }
    })

    it("spawns a brotli encoder", async () => {
        const spy = jest.fn();
        const enc = new Encoder({
            content: { hello: "world" },
            zip: "brotli"
        }, spy, true)
        await sleep(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, enc);
        expect(enc.buffer).toBeDefined();
        if (enc.buffer) {
            expect(enc.buffer.length).toBeGreaterThan(0);
            expect(enc.toArrayBuffer(enc.buffer) instanceof ArrayBuffer).toBeTruthy()
        }
    })

    it("fails caused by wrong json content", async () => {
        const spy = jest.fn();
        const enc = new Encoder({
            content: "HelloWorld!",
            zip: "brotli",
        }, spy)
        await sleep(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(new Error(ENCODER_ERRORS.WRONG_MESSAGE_CONTENT), enc);
    })

    it("fails caused by failure during zip", async () => {
        const spy = jest.fn();

        const enc = new Encoder({
            content: { hello: "world" },
            zip: "gzip"
        }, spy)
        await sleep(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        spy.mockClear()

        enc.zip_cmd = jest.fn(() => (content, cb) => {
            cb(new Error("Emulated zip error"), Buffer.from(""));
        });
        enc.build()
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(new Error(ENCODER_ERRORS.ZIP_COMPRESS_ERROR), enc);
    })
})