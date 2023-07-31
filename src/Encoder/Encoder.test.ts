import Encoder, { ENCODER_ERRORS, EncodedMessage } from "."


describe("Encoder lifecycle and props", () => {
    it("spawns an encoder", (done) => {
        const spy = jest.fn((e: Error | null, encodedMessage?: EncodedMessage) => {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                }
            }
            done()
        });
        const enc = new Encoder()
        enc.build({
            content: { hello: "world" },
        }, spy)

    })

    it("spawns a gzip encoder", (done) => {
        const spy = jest.fn((e: Error | null, encodedMessage?: EncodedMessage) => {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                }
            }
            done()
        });
        const enc = new Encoder()
        enc.build({
            content: { hello: "world" },
            zip: "gzip"
        }, spy)

    })

    it("spawns an inflate encoder and finalize=false", (done) => {
        const spy = jest.fn((e: Error | null, encodedMessage?: EncodedMessage) => {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.id).toEqual("emulated-uid")
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                }
            }
            done()
        });
        const enc = new Encoder()
        enc.build({
            requestId: "emulated-uid",
            content: { hello: "world" },
            zip: "inflate",
            finalize: false
        }, spy)

    })

    it("spawns an inflate encoder with a binary message", (done) => {
        const spy = jest.fn((e: Error | null, encodedMessage?: EncodedMessage) => {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                }
            }
            done()
        });
        const enc = new Encoder()
        enc.build({
            type: "b",
            content: Buffer.from("HelloWorld!"),
            zip: "inflate",
            finalize: true
        }, spy)
    })

    it("spawns an inflate encoder with a binary null message", (done) => {
        const spy = jest.fn((e: Error | null, encodedMessage?: EncodedMessage) => {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                }
            }
            done()
        });
        const enc = new Encoder()
        enc.build({
            type: "b",
            content: null,
            zip: "inflate",
            finalize: true
        }, spy)
    })

    it("spawns a brotli encoder", (done) => {
        const enc = new Encoder(true)

        const spy = jest.fn((e: Error | null, encodedMessage?: EncodedMessage) => {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                    expect(enc.toArrayBuffer(encodedMessage.buffer) instanceof ArrayBuffer).toBeTruthy()
                }
            }
            done()
        });
        enc.build({
            content: { hello: "world" },
            zip: "brotli"
        }, spy)


    })

    it("fails caused by wrong json content", (done) => {
        const spy = jest.fn((e: Error | null, encodedMessage?: EncodedMessage) => {
            expect(e !== null).toBeTruthy();
            expect(e?.message).toEqual(ENCODER_ERRORS.WRONG_MESSAGE_CONTENT);
            done()
        });
        const enc = new Encoder()
        enc.build({
            content: "HelloWorld!",
            zip: "brotli",
        }, spy)
    })


    it("fails caused by failure during zip", (done) => {
        const spy = jest.fn((e: Error | null, encodedMessage?: EncodedMessage) => {
            expect(e !== null).toBeTruthy();
            expect(e?.message).toEqual(ENCODER_ERRORS.ZIP_COMPRESS_ERROR);
            done()
        });

        const enc = new Encoder()
        enc.zip_cmd = jest.fn(() => (content, cb) => {
            cb(new Error("Emulated zip error"), Buffer.from(""));
        });
        enc.build({
            content: { hello: "world" },
            zip: "gzip"
        }, spy)

    })

})