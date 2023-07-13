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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __importStar(require("."));
var HELLO_WORLD = 'ZjcwZWVjYTUtZjVhZS00ZDllLWFmNjktYWExNmYyNWY4NjRjICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMTcweyJoZWxsbyI6IndvcmxkIn0=';
var GZIP_HELLO_WORLD = 'ZGNmZDA0ZWEtYTkwNS00NTI5LWEwNGUtMDJjNzg5MDMxMzdkICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMzdnH4sIAAAAAAAAA6tWykjNyclXslIqzy/KSVGqBQDRQQnYEQAAAA==';
var DEFLATE_HELLO_WORLD = 'NTM4MTMyYzctNDAxZS00ZjFjLWFjZWItY2FkMjZjNjBiNjNkICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMjVpeJyrVspIzcnJV7JSKs8vyklRqgUANWsF9w==';
var BROTLI_HELLO_WORLD = 'YzJlODdjNTctMTBmNC00MmVjLTgwN2EtYzI0N2FkYzg0ZTgxICAgICAgICAgMDFqICAgICAgICAgICAgICAgICAgMjFiCwiAeyJoZWxsbyI6IndvcmxkIn0D';
var DEFLATE_BINARY_HELLO_WORLD = 'MDA0Nzc5MzYtMGZjMC00N2E4LTkwOWEtM2NkZDI1MWFiNzFkICAgICAgICAgMDFiICAgICAgICAgICAgICAgICAgMTlpeJzzSM3JyQ/PL8pJUQQAGXQEHg==';
var sleep = function (ms) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
    });
};
describe("Decoder lifecycle", function () {
    it("spawns a decoder instance", function () {
        var spy = jest.fn(function (e, decodedMessage) {
            expect(e instanceof Error).toBeTruthy();
            if (e) {
                expect(e.message).toEqual(_1.DECODER_ERRORS.WRONG_MESSAGE_FORMAT);
            }
            expect(decodedMessage).toBeUndefined();
        });
        var decoder = new _1.default(false);
        decoder.read(Buffer.from("hello world"), spy);
        expect(spy).toHaveBeenCalledTimes(1);
    });
    it("decodes hello world json message", function () {
        var spy = jest.fn(function (e, decodedMessage) {
            expect(e === null).toBeTruthy();
            expect(decodedMessage).toBeDefined();
            if (decodedMessage) {
                expect(decodedMessage.content).toBeDefined();
                expect(typeof decodedMessage.content).toEqual("object");
                expect(decodedMessage.content.hello).toEqual("world");
            }
        });
        var decoder = new _1.default(false);
        decoder.read(Buffer.from(HELLO_WORLD, 'base64'), spy);
        expect(spy).toHaveBeenCalledTimes(1);
    });
    it("decodes hello world json gzipped message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, decoder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jest.fn(function (e, decodedMessage) {
                        expect(e === null).toBeTruthy();
                        expect(decodedMessage).toBeDefined();
                        if (decodedMessage) {
                            expect(decodedMessage.content).toBeDefined();
                            expect(typeof decodedMessage.content).toEqual("object");
                            expect(decodedMessage.content.hello).toEqual("world");
                        }
                    });
                    decoder = new _1.default(false);
                    decoder.read(Buffer.from(GZIP_HELLO_WORLD, 'base64'), spy);
                    return [4, sleep(1000)];
                case 1:
                    _a.sent();
                    expect(spy).toHaveBeenCalledTimes(1);
                    return [2];
            }
        });
    }); });
    it("decodes hello world json deflated message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, decoder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jest.fn(function (e, decodedMessage) {
                        expect(e === null).toBeTruthy();
                        expect(decodedMessage).toBeDefined();
                        if (decodedMessage) {
                            expect(decodedMessage.content).toBeDefined();
                            expect(typeof decodedMessage.content).toEqual("object");
                            expect(decodedMessage.content.hello).toEqual("world");
                        }
                    });
                    decoder = new _1.default(false);
                    decoder.read(Buffer.from(DEFLATE_HELLO_WORLD, 'base64'), spy);
                    return [4, sleep(1000)];
                case 1:
                    _a.sent();
                    expect(spy).toHaveBeenCalledTimes(1);
                    return [2];
            }
        });
    }); });
    it("decodes binary deflated message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, decoder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jest.fn(function (e, decodedMessage) {
                        expect(e === null).toBeTruthy();
                        expect(decodedMessage).toBeDefined();
                        if (decodedMessage) {
                            expect(decodedMessage.content).toBeDefined();
                            expect(decodedMessage.content instanceof Buffer).toBeTruthy();
                            expect(decodedMessage.content.toString("utf-8")).toEqual("HelloWorld!");
                        }
                    });
                    decoder = new _1.default(false);
                    decoder.read(Buffer.from(DEFLATE_BINARY_HELLO_WORLD, 'base64'), spy);
                    return [4, sleep(1000)];
                case 1:
                    _a.sent();
                    expect(spy).toHaveBeenCalledTimes(1);
                    return [2];
            }
        });
    }); });
    it("decodes hello world json brotli message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, decoder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jest.fn(function (e, decodedMessage) {
                        expect(e === null).toBeTruthy();
                        expect(decodedMessage).toBeDefined();
                        if (decodedMessage) {
                            expect(decodedMessage.content).toBeDefined();
                            expect(typeof decodedMessage.content).toEqual("object");
                            expect(decodedMessage.content.hello).toEqual("world");
                        }
                    });
                    decoder = new _1.default(true);
                    decoder.read(Buffer.from(BROTLI_HELLO_WORLD, 'base64'), spy);
                    return [4, sleep(1000)];
                case 1:
                    _a.sent();
                    expect(spy).toHaveBeenCalledTimes(1);
                    return [2];
            }
        });
    }); });
    it("fails due to decompression error", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, decoder;
        return __generator(this, function (_a) {
            spy = jest.fn(function (e, decodedMessage) {
                expect(e instanceof Error).toBeTruthy();
                if (e) {
                    expect(e.message).toEqual(_1.DECODER_ERRORS.ZIP_DECOMPRESSION_ERROR);
                }
            });
            decoder = new _1.default(true);
            decoder.unzip_cmd = jest.fn(function () { return function (content, cb) {
                cb(new Error("Emulated zip error"), Buffer.from(""));
            }; });
            decoder.read(Buffer.from(BROTLI_HELLO_WORLD, 'base64'), spy);
            expect(spy).toHaveBeenCalledTimes(1);
            return [2];
        });
    }); });
});
//# sourceMappingURL=Decoder.test.js.map