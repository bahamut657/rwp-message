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
var HELLO_WORLD = 'ZjcwZWVjYTUtZjVhZS00ZDllLWFmNjktYWExNmYyNWY4NjRjICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMTcweyJoZWxsbyI6IndvcmxkIn0=';
var GZIP_HELLO_WORLD = 'ZGNmZDA0ZWEtYTkwNS00NTI5LWEwNGUtMDJjNzg5MDMxMzdkICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMzdnH4sIAAAAAAAAA6tWykjNyclXslIqzy/KSVGqBQDRQQnYEQAAAA==';
var DEFLATE_HELLO_WORLD = 'NTM4MTMyYzctNDAxZS00ZjFjLWFjZWItY2FkMjZjNjBiNjNkICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMjVpeJyrVspIzcnJV7JSKs8vyklRqgUANWsF9w==';
var BROTLI_HELLO_WORLD = 'YzJlODdjNTctMTBmNC00MmVjLTgwN2EtYzI0N2FkYzg0ZTgxICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMjFiCwiAeyJoZWxsbyI6IndvcmxkIn0D';
var DEFLATE_BINARY_HELLO_WORLD = 'MDA0Nzc5MzYtMGZjMC00N2E4LTkwOWEtM2NkZDI1MWFiNzFkICAgICAgICAgMDFiICAgICAgICAgICAgICAgICAgMTlpeJzzSM3JyQ/PL8pJUQQAGXQEHg==';
describe("Decoder lifecycle", function () {
    it("spawns a decoder instance", function (done) {
        var spy = jest.fn(function (e, decodedMessage) {
            expect(e instanceof Error).toBeTruthy();
            if (e) {
                expect(e.message).toEqual(_1.DECODER_ERRORS.WRONG_MESSAGE_FORMAT);
            }
            expect(decodedMessage).toBeUndefined();
            done();
        });
        var decoder = new _1.default(false);
        decoder.read(Buffer.from("hello world"), spy);
    });
    it("decodes hello world json message", function (done) {
        var spy = jest.fn(function (e, decodedMessage) {
            expect(e === null).toBeTruthy();
            expect(decodedMessage).toBeDefined();
            if (decodedMessage) {
                expect(decodedMessage.content).toBeDefined();
                expect(typeof decodedMessage.content).toEqual("object");
                expect(decodedMessage.content.hello).toEqual("world");
            }
            done();
        });
        var decoder = new _1.default(false);
        decoder.read(Buffer.from(HELLO_WORLD, 'base64'), spy);
    });
    it("decodes hello world json gzipped message", function (done) {
        var spy = jest.fn(function (e, decodedMessage) {
            expect(e === null).toBeTruthy();
            expect(decodedMessage).toBeDefined();
            if (decodedMessage) {
                expect(decodedMessage.content).toBeDefined();
                expect(typeof decodedMessage.content).toEqual("object");
                expect(decodedMessage.content.hello).toEqual("world");
            }
            done();
        });
        var decoder = new _1.default(false);
        decoder.read(Buffer.from(GZIP_HELLO_WORLD, 'base64'), spy);
    });
    it("decodes hello world json deflated message", function (done) {
        var spy = jest.fn(function (e, decodedMessage) {
            expect(e === null).toBeTruthy();
            expect(decodedMessage).toBeDefined();
            if (decodedMessage) {
                expect(decodedMessage.content).toBeDefined();
                expect(typeof decodedMessage.content).toEqual("object");
                expect(decodedMessage.content.hello).toEqual("world");
            }
            done();
        });
        var decoder = new _1.default(false);
        decoder.read(Buffer.from(DEFLATE_HELLO_WORLD, 'base64'), spy);
    });
    it("decodes binary deflated message", function (done) {
        var spy = jest.fn(function (e, decodedMessage) {
            expect(e === null).toBeTruthy();
            expect(decodedMessage).toBeDefined();
            if (decodedMessage) {
                expect(decodedMessage.content).toBeDefined();
                expect(decodedMessage.content instanceof Buffer).toBeTruthy();
                expect(decodedMessage.content.toString("utf-8")).toEqual("HelloWorld!");
            }
            done();
        });
        var decoder = new _1.default(false);
        decoder.read(Buffer.from(DEFLATE_BINARY_HELLO_WORLD, 'base64'), spy);
    });
    it("decodes hello world json brotli message", function (done) {
        var spy = jest.fn(function (e, decodedMessage) {
            expect(e === null).toBeTruthy();
            expect(decodedMessage).toBeDefined();
            if (decodedMessage) {
                expect(decodedMessage.content).toBeDefined();
                expect(typeof decodedMessage.content).toEqual("object");
                expect(decodedMessage.content.hello).toEqual("world");
            }
            done();
        });
        var decoder = new _1.default(true);
        decoder.read(Buffer.from(BROTLI_HELLO_WORLD, 'base64'), spy);
    });
    it("fails due to decompression error", function (done) {
        var spy = jest.fn(function (e, decodedMessage) {
            expect(e instanceof Error).toBeTruthy();
            if (e) {
                expect(e.message).toEqual(_1.DECODER_ERRORS.ZIP_DECOMPRESSION_ERROR);
            }
            done();
        });
        var decoder = new _1.default(true);
        decoder.unzip_cmd = jest.fn(function () { return function (content, cb) {
            cb(new Error("Emulated zip error"), Buffer.from(""));
        }; });
        decoder.read(Buffer.from(BROTLI_HELLO_WORLD, 'base64'), spy);
    });
});
//# sourceMappingURL=Decoder.test.js.map