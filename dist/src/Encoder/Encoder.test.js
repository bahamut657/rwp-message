"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __importStar(require("."));
describe("Encoder lifecycle and props", function () {
    it("spawns an encoder", function (done) {
        var spy = jest.fn(function (e, encodedMessage) {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                }
            }
            done();
        });
        var enc = new _1.default();
        enc.build({
            content: { hello: "world" },
        }, spy);
    });
    it("spawns a gzip encoder", function (done) {
        var spy = jest.fn(function (e, encodedMessage) {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                }
            }
            done();
        });
        var enc = new _1.default();
        enc.build({
            content: { hello: "world" },
            zip: "gzip"
        }, spy);
    });
    it("spawns an inflate encoder and finalize=false", function (done) {
        var spy = jest.fn(function (e, encodedMessage) {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.id).toEqual("emulated-uid");
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                }
            }
            done();
        });
        var enc = new _1.default();
        enc.build({
            requestId: "emulated-uid",
            content: { hello: "world" },
            zip: "inflate",
            finalize: false
        }, spy);
    });
    it("spawns an inflate encoder with a binary message", function (done) {
        var spy = jest.fn(function (e, encodedMessage) {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                }
            }
            done();
        });
        var enc = new _1.default();
        enc.build({
            type: "b",
            content: Buffer.from("HelloWorld!"),
            zip: "inflate",
            finalize: true
        }, spy);
    });
    it("spawns an inflate encoder with a binary null message", function (done) {
        var spy = jest.fn(function (e, encodedMessage) {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                }
            }
            done();
        });
        var enc = new _1.default();
        enc.build({
            type: "b",
            content: null,
            zip: "inflate",
            finalize: true
        }, spy);
    });
    it("spawns a brotli encoder", function (done) {
        var enc = new _1.default(true);
        var spy = jest.fn(function (e, encodedMessage) {
            expect(e).toEqual(null);
            expect(encodedMessage).toBeDefined();
            if (encodedMessage) {
                expect(encodedMessage.buffer).toBeDefined();
                if (encodedMessage.buffer) {
                    expect(encodedMessage.buffer.length).toBeGreaterThan(0);
                    expect(enc.toArrayBuffer(encodedMessage.buffer) instanceof ArrayBuffer).toBeTruthy();
                }
            }
            done();
        });
        enc.build({
            content: { hello: "world" },
            zip: "brotli"
        }, spy);
    });
    it("fails caused by wrong json content", function (done) {
        var spy = jest.fn(function (e, encodedMessage) {
            expect(e !== null).toBeTruthy();
            expect(e === null || e === void 0 ? void 0 : e.message).toEqual(_1.ENCODER_ERRORS.WRONG_MESSAGE_CONTENT);
            done();
        });
        var enc = new _1.default();
        enc.build({
            content: "HelloWorld!",
            zip: "brotli",
        }, spy);
    });
    it("fails caused by failure during zip", function (done) {
        var spy = jest.fn(function (e, encodedMessage) {
            expect(e !== null).toBeTruthy();
            expect(e === null || e === void 0 ? void 0 : e.message).toEqual(_1.ENCODER_ERRORS.ZIP_COMPRESS_ERROR);
            done();
        });
        var enc = new _1.default();
        enc.zip_cmd = jest.fn(function () { return function (content, cb) {
            cb(new Error("Emulated zip error"), Buffer.from(""));
        }; });
        enc.build({
            content: { hello: "world" },
            zip: "gzip"
        }, spy);
    });
});
//# sourceMappingURL=Encoder.test.js.map