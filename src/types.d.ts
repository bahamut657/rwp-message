import zlib from "node:zlib"

export type MadMessageType = 'b' | 'f' | 'm' | 'j' | 'w'

export type MadMessageCompression = '0' | 'b' | 'g' | 'i'

export type MadMessageCompressionName = '' | "brotli" | "gzip" | "inflate"

export type ZlibMethod = (buf: zlib.InputType, callback: zlib.CompressCallback) => void
