/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_panic_hook(): void;
/**
* @param {TfheServerKey} server_key
*/
export function set_server_key(server_key: TfheServerKey): void;
/**
*/
export enum ShortintParametersName {
  PARAM_MESSAGE_1_CARRY_0_KS_PBS = 0,
  PARAM_MESSAGE_1_CARRY_1_KS_PBS = 1,
  PARAM_MESSAGE_2_CARRY_0_KS_PBS = 2,
  PARAM_MESSAGE_1_CARRY_2_KS_PBS = 3,
  PARAM_MESSAGE_2_CARRY_1_KS_PBS = 4,
  PARAM_MESSAGE_3_CARRY_0_KS_PBS = 5,
  PARAM_MESSAGE_1_CARRY_3_KS_PBS = 6,
  PARAM_MESSAGE_2_CARRY_2_KS_PBS = 7,
  PARAM_MESSAGE_3_CARRY_1_KS_PBS = 8,
  PARAM_MESSAGE_4_CARRY_0_KS_PBS = 9,
  PARAM_MESSAGE_1_CARRY_4_KS_PBS = 10,
  PARAM_MESSAGE_2_CARRY_3_KS_PBS = 11,
  PARAM_MESSAGE_3_CARRY_2_KS_PBS = 12,
  PARAM_MESSAGE_4_CARRY_1_KS_PBS = 13,
  PARAM_MESSAGE_5_CARRY_0_KS_PBS = 14,
  PARAM_MESSAGE_1_CARRY_5_KS_PBS = 15,
  PARAM_MESSAGE_2_CARRY_4_KS_PBS = 16,
  PARAM_MESSAGE_3_CARRY_3_KS_PBS = 17,
  PARAM_MESSAGE_4_CARRY_2_KS_PBS = 18,
  PARAM_MESSAGE_5_CARRY_1_KS_PBS = 19,
  PARAM_MESSAGE_6_CARRY_0_KS_PBS = 20,
  PARAM_MESSAGE_1_CARRY_6_KS_PBS = 21,
  PARAM_MESSAGE_2_CARRY_5_KS_PBS = 22,
  PARAM_MESSAGE_3_CARRY_4_KS_PBS = 23,
  PARAM_MESSAGE_4_CARRY_3_KS_PBS = 24,
  PARAM_MESSAGE_5_CARRY_2_KS_PBS = 25,
  PARAM_MESSAGE_6_CARRY_1_KS_PBS = 26,
  PARAM_MESSAGE_7_CARRY_0_KS_PBS = 27,
  PARAM_MESSAGE_1_CARRY_7_KS_PBS = 28,
  PARAM_MESSAGE_2_CARRY_6_KS_PBS = 29,
  PARAM_MESSAGE_3_CARRY_5_KS_PBS = 30,
  PARAM_MESSAGE_4_CARRY_4_KS_PBS = 31,
  PARAM_MESSAGE_5_CARRY_3_KS_PBS = 32,
  PARAM_MESSAGE_6_CARRY_2_KS_PBS = 33,
  PARAM_MESSAGE_7_CARRY_1_KS_PBS = 34,
  PARAM_MESSAGE_8_CARRY_0_KS_PBS = 35,
  PARAM_MESSAGE_1_CARRY_1_PBS_KS = 36,
  PARAM_MESSAGE_2_CARRY_2_PBS_KS = 37,
  PARAM_MESSAGE_3_CARRY_3_PBS_KS = 38,
  PARAM_MESSAGE_4_CARRY_4_PBS_KS = 39,
  PARAM_MESSAGE_1_CARRY_2_COMPACT_PK_KS_PBS = 40,
  PARAM_MESSAGE_1_CARRY_3_COMPACT_PK_KS_PBS = 41,
  PARAM_MESSAGE_1_CARRY_4_COMPACT_PK_KS_PBS = 42,
  PARAM_MESSAGE_1_CARRY_5_COMPACT_PK_KS_PBS = 43,
  PARAM_MESSAGE_1_CARRY_6_COMPACT_PK_KS_PBS = 44,
  PARAM_MESSAGE_1_CARRY_7_COMPACT_PK_KS_PBS = 45,
  PARAM_MESSAGE_2_CARRY_1_COMPACT_PK_KS_PBS = 46,
  PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_KS_PBS = 47,
  PARAM_MESSAGE_2_CARRY_3_COMPACT_PK_KS_PBS = 48,
  PARAM_MESSAGE_2_CARRY_4_COMPACT_PK_KS_PBS = 49,
  PARAM_MESSAGE_2_CARRY_5_COMPACT_PK_KS_PBS = 50,
  PARAM_MESSAGE_2_CARRY_6_COMPACT_PK_KS_PBS = 51,
  PARAM_MESSAGE_3_CARRY_1_COMPACT_PK_KS_PBS = 52,
  PARAM_MESSAGE_3_CARRY_2_COMPACT_PK_KS_PBS = 53,
  PARAM_MESSAGE_3_CARRY_3_COMPACT_PK_KS_PBS = 54,
  PARAM_MESSAGE_3_CARRY_4_COMPACT_PK_KS_PBS = 55,
  PARAM_MESSAGE_3_CARRY_5_COMPACT_PK_KS_PBS = 56,
  PARAM_MESSAGE_4_CARRY_1_COMPACT_PK_KS_PBS = 57,
  PARAM_MESSAGE_4_CARRY_2_COMPACT_PK_KS_PBS = 58,
  PARAM_MESSAGE_4_CARRY_3_COMPACT_PK_KS_PBS = 59,
  PARAM_MESSAGE_4_CARRY_4_COMPACT_PK_KS_PBS = 60,
  PARAM_MESSAGE_5_CARRY_1_COMPACT_PK_KS_PBS = 61,
  PARAM_MESSAGE_5_CARRY_2_COMPACT_PK_KS_PBS = 62,
  PARAM_MESSAGE_5_CARRY_3_COMPACT_PK_KS_PBS = 63,
  PARAM_MESSAGE_6_CARRY_1_COMPACT_PK_KS_PBS = 64,
  PARAM_MESSAGE_6_CARRY_2_COMPACT_PK_KS_PBS = 65,
  PARAM_MESSAGE_7_CARRY_1_COMPACT_PK_KS_PBS = 66,
  PARAM_MESSAGE_1_CARRY_1_COMPACT_PK_PBS_KS = 67,
  PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS = 68,
  PARAM_MESSAGE_3_CARRY_3_COMPACT_PK_PBS_KS = 69,
  PARAM_MESSAGE_4_CARRY_4_COMPACT_PK_PBS_KS = 70,
  PARAM_MESSAGE_2_CARRY_2_KS_PBS_TUNIFORM_2M64 = 71,
  PARAM_MESSAGE_1_CARRY_0 = 72,
  PARAM_MESSAGE_1_CARRY_1 = 73,
  PARAM_MESSAGE_2_CARRY_0 = 74,
  PARAM_MESSAGE_1_CARRY_2 = 75,
  PARAM_MESSAGE_2_CARRY_1 = 76,
  PARAM_MESSAGE_3_CARRY_0 = 77,
  PARAM_MESSAGE_1_CARRY_3 = 78,
  PARAM_MESSAGE_2_CARRY_2 = 79,
  PARAM_MESSAGE_3_CARRY_1 = 80,
  PARAM_MESSAGE_4_CARRY_0 = 81,
  PARAM_MESSAGE_1_CARRY_4 = 82,
  PARAM_MESSAGE_2_CARRY_3 = 83,
  PARAM_MESSAGE_3_CARRY_2 = 84,
  PARAM_MESSAGE_4_CARRY_1 = 85,
  PARAM_MESSAGE_5_CARRY_0 = 86,
  PARAM_MESSAGE_1_CARRY_5 = 87,
  PARAM_MESSAGE_2_CARRY_4 = 88,
  PARAM_MESSAGE_3_CARRY_3 = 89,
  PARAM_MESSAGE_4_CARRY_2 = 90,
  PARAM_MESSAGE_5_CARRY_1 = 91,
  PARAM_MESSAGE_6_CARRY_0 = 92,
  PARAM_MESSAGE_1_CARRY_6 = 93,
  PARAM_MESSAGE_2_CARRY_5 = 94,
  PARAM_MESSAGE_3_CARRY_4 = 95,
  PARAM_MESSAGE_4_CARRY_3 = 96,
  PARAM_MESSAGE_5_CARRY_2 = 97,
  PARAM_MESSAGE_6_CARRY_1 = 98,
  PARAM_MESSAGE_7_CARRY_0 = 99,
  PARAM_MESSAGE_1_CARRY_7 = 100,
  PARAM_MESSAGE_2_CARRY_6 = 101,
  PARAM_MESSAGE_3_CARRY_5 = 102,
  PARAM_MESSAGE_4_CARRY_4 = 103,
  PARAM_MESSAGE_5_CARRY_3 = 104,
  PARAM_MESSAGE_6_CARRY_2 = 105,
  PARAM_MESSAGE_7_CARRY_1 = 106,
  PARAM_MESSAGE_8_CARRY_0 = 107,
  PARAM_SMALL_MESSAGE_1_CARRY_1 = 108,
  PARAM_SMALL_MESSAGE_2_CARRY_2 = 109,
  PARAM_SMALL_MESSAGE_3_CARRY_3 = 110,
  PARAM_SMALL_MESSAGE_4_CARRY_4 = 111,
}
/**
*/
export enum ShortintEncryptionKeyChoice {
  Big = 0,
  Small = 1,
}
/**
*/
export enum ShortintCompactPublicKeyEncryptionParametersName {
  SHORTINT_PARAM_PKE_MESSAGE_2_CARRY_2_KS_PBS_TUNIFORM_2M64 = 0,
}
/**
*/
export enum ShortintPBSOrder {
  KeyswitchBootstrap = 0,
  BootstrapKeyswitch = 1,
}
/**
*/
export enum FheTypes {
  Bool = 0,
  Uint2 = 1,
  Uint4 = 2,
  Uint6 = 3,
  Uint8 = 4,
  Uint10 = 5,
  Uint12 = 6,
  Uint14 = 7,
  Uint16 = 8,
  Uint32 = 9,
  Uint64 = 10,
  Uint128 = 11,
  Uint160 = 12,
  Uint256 = 13,
  Uint512 = 14,
  Uint1024 = 15,
  Uint2048 = 16,
  Int2 = 17,
  Int4 = 18,
  Int6 = 19,
  Int8 = 20,
  Int10 = 21,
  Int12 = 22,
  Int14 = 23,
  Int16 = 24,
  Int32 = 25,
  Int64 = 26,
  Int128 = 27,
  Int160 = 28,
  Int256 = 29,
}
/**
*/
export class CompactCiphertextList {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {CompactCiphertextList}
*/
  static deserialize(buffer: Uint8Array): CompactCiphertextList;
/**
* @param {number} index
* @returns {FheTypes | undefined}
*/
  get_kind_of(index: number): FheTypes | undefined;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompactCiphertextList}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactCiphertextList;
/**
* @returns {number}
*/
  len(): number;
/**
* @returns {CompactCiphertextListExpander}
*/
  expand(): CompactCiphertextListExpander;
/**
* @param {TfheCompactPublicKey} public_key
* @returns {CompactCiphertextListBuilder}
*/
  static builder(public_key: TfheCompactPublicKey): CompactCiphertextListBuilder;
/**
* @returns {boolean}
*/
  is_empty(): boolean;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompactCiphertextListBuilder {
  free(): void;
/**
* @param {any} value
*/
  push_u1024(value: any): void;
/**
* @param {any} value
*/
  push_u2048(value: any): void;
/**
* @returns {CompactCiphertextList}
*/
  build_packed(): CompactCiphertextList;
/**
* @param {boolean} value
*/
  push_boolean(value: boolean): void;
/**
* @returns {CompactCiphertextList}
*/
  build(): CompactCiphertextList;
/**
* @param {number} value
*/
  push_i2(value: number): void;
/**
* @param {number} value
*/
  push_i4(value: number): void;
/**
* @param {number} value
*/
  push_i6(value: number): void;
/**
* @param {number} value
*/
  push_i8(value: number): void;
/**
* @param {number} value
*/
  push_u2(value: number): void;
/**
* @param {number} value
*/
  push_u4(value: number): void;
/**
* @param {number} value
*/
  push_u6(value: number): void;
/**
* @param {number} value
*/
  push_u8(value: number): void;
/**
* @param {number} value
*/
  push_i10(value: number): void;
/**
* @param {number} value
*/
  push_i12(value: number): void;
/**
* @param {number} value
*/
  push_i14(value: number): void;
/**
* @param {number} value
*/
  push_i16(value: number): void;
/**
* @param {number} value
*/
  push_i32(value: number): void;
/**
* @param {bigint} value
*/
  push_i64(value: bigint): void;
/**
* @param {number} value
*/
  push_u10(value: number): void;
/**
* @param {number} value
*/
  push_u12(value: number): void;
/**
* @param {number} value
*/
  push_u14(value: number): void;
/**
* @param {number} value
*/
  push_u16(value: number): void;
/**
* @param {number} value
*/
  push_u32(value: number): void;
/**
* @param {bigint} value
*/
  push_u64(value: bigint): void;
/**
* @param {any} value
*/
  push_i128(value: any): void;
/**
* @param {any} value
*/
  push_i160(value: any): void;
/**
* @param {any} value
*/
  push_i256(value: any): void;
/**
* @param {any} value
*/
  push_u128(value: any): void;
/**
* @param {any} value
*/
  push_u160(value: any): void;
/**
* @param {any} value
*/
  push_u256(value: any): void;
/**
* @param {any} value
*/
  push_u512(value: any): void;
}
/**
*/
export class CompactCiphertextListExpander {
  free(): void;
/**
* @param {number} index
* @returns {FheInt128}
*/
  get_int128(index: number): FheInt128;
/**
* @param {number} index
* @returns {FheInt160}
*/
  get_int160(index: number): FheInt160;
/**
* @param {number} index
* @returns {FheInt256}
*/
  get_int256(index: number): FheInt256;
/**
* @param {number} index
* @returns {FheUint10}
*/
  get_uint10(index: number): FheUint10;
/**
* @param {number} index
* @returns {FheUint12}
*/
  get_uint12(index: number): FheUint12;
/**
* @param {number} index
* @returns {FheUint14}
*/
  get_uint14(index: number): FheUint14;
/**
* @param {number} index
* @returns {FheUint16}
*/
  get_uint16(index: number): FheUint16;
/**
* @param {number} index
* @returns {FheUint32}
*/
  get_uint32(index: number): FheUint32;
/**
* @param {number} index
* @returns {FheUint64}
*/
  get_uint64(index: number): FheUint64;
/**
* @param {number} index
* @returns {FheTypes | undefined}
*/
  get_kind_of(index: number): FheTypes | undefined;
/**
* @param {number} index
* @returns {FheUint128}
*/
  get_uint128(index: number): FheUint128;
/**
* @param {number} index
* @returns {FheUint160}
*/
  get_uint160(index: number): FheUint160;
/**
* @param {number} index
* @returns {FheUint256}
*/
  get_uint256(index: number): FheUint256;
/**
* @param {number} index
* @returns {FheUint512}
*/
  get_uint512(index: number): FheUint512;
/**
* @param {number} index
* @returns {FheUint1024}
*/
  get_uint1024(index: number): FheUint1024;
/**
* @param {number} index
* @returns {FheUint2048}
*/
  get_uint2048(index: number): FheUint2048;
/**
* @returns {number}
*/
  len(): number;
/**
* @param {number} index
* @returns {FheBool}
*/
  get_bool(index: number): FheBool;
/**
* @param {number} index
* @returns {FheInt2}
*/
  get_int2(index: number): FheInt2;
/**
* @param {number} index
* @returns {FheInt4}
*/
  get_int4(index: number): FheInt4;
/**
* @param {number} index
* @returns {FheInt6}
*/
  get_int6(index: number): FheInt6;
/**
* @param {number} index
* @returns {FheInt8}
*/
  get_int8(index: number): FheInt8;
/**
* @returns {boolean}
*/
  is_empty(): boolean;
/**
* @param {number} index
* @returns {FheInt10}
*/
  get_int10(index: number): FheInt10;
/**
* @param {number} index
* @returns {FheInt12}
*/
  get_int12(index: number): FheInt12;
/**
* @param {number} index
* @returns {FheInt14}
*/
  get_int14(index: number): FheInt14;
/**
* @param {number} index
* @returns {FheInt16}
*/
  get_int16(index: number): FheInt16;
/**
* @param {number} index
* @returns {FheInt32}
*/
  get_int32(index: number): FheInt32;
/**
* @param {number} index
* @returns {FheInt64}
*/
  get_int64(index: number): FheInt64;
/**
* @param {number} index
* @returns {FheUint2}
*/
  get_uint2(index: number): FheUint2;
/**
* @param {number} index
* @returns {FheUint4}
*/
  get_uint4(index: number): FheUint4;
/**
* @param {number} index
* @returns {FheUint6}
*/
  get_uint6(index: number): FheUint6;
/**
* @param {number} index
* @returns {FheUint8}
*/
  get_uint8(index: number): FheUint8;
}
/**
*/
export class CompressedFheBool {
  free(): void;
/**
* @returns {FheBool}
*/
  decompress(): FheBool;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheBool}
*/
  static deserialize(buffer: Uint8Array): CompressedFheBool;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheBool}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheBool;
/**
* @param {boolean} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheBool}
*/
  static encrypt_with_client_key(value: boolean, client_key: TfheClientKey): CompressedFheBool;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt10 {
  free(): void;
/**
* @returns {FheInt10}
*/
  decompress(): FheInt10;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt10}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt10;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt10}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt10;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt10}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt10;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt12 {
  free(): void;
/**
* @returns {FheInt12}
*/
  decompress(): FheInt12;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt12}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt12;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt12}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt12;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt12}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt12;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt128 {
  free(): void;
/**
* @returns {FheInt128}
*/
  decompress(): FheInt128;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt128}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt128;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt128}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt128;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt128}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheInt128;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt14 {
  free(): void;
/**
* @returns {FheInt14}
*/
  decompress(): FheInt14;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt14}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt14;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt14}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt14;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt14}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt14;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt16 {
  free(): void;
/**
* @returns {FheInt16}
*/
  decompress(): FheInt16;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt16}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt16;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt16}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt16;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt16}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt16;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt160 {
  free(): void;
/**
* @returns {FheInt160}
*/
  decompress(): FheInt160;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt160}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt160;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt160}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt160;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt160}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheInt160;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt2 {
  free(): void;
/**
* @returns {FheInt2}
*/
  decompress(): FheInt2;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt2}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt2;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt2}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt2;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt2}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt2;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt256 {
  free(): void;
/**
* @returns {FheInt256}
*/
  decompress(): FheInt256;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt256}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt256;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt256}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt256;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt256}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheInt256;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt32 {
  free(): void;
/**
* @returns {FheInt32}
*/
  decompress(): FheInt32;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt32}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt32;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt32}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt32;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt32}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt32;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt4 {
  free(): void;
/**
* @returns {FheInt4}
*/
  decompress(): FheInt4;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt4}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt4;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt4}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt4;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt4}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt4;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt6 {
  free(): void;
/**
* @returns {FheInt6}
*/
  decompress(): FheInt6;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt6}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt6;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt6}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt6;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt6}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt6;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt64 {
  free(): void;
/**
* @returns {FheInt64}
*/
  decompress(): FheInt64;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt64}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt64;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt64}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt64;
/**
* @param {bigint} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt64}
*/
  static encrypt_with_client_key(value: bigint, client_key: TfheClientKey): CompressedFheInt64;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheInt8 {
  free(): void;
/**
* @returns {FheInt8}
*/
  decompress(): FheInt8;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheInt8}
*/
  static deserialize(buffer: Uint8Array): CompressedFheInt8;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheInt8}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt8;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheInt8}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt8;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint10 {
  free(): void;
/**
* @returns {FheUint10}
*/
  decompress(): FheUint10;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint10}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint10;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint10}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint10;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint10}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint10;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint1024 {
  free(): void;
/**
* @returns {FheUint1024}
*/
  decompress(): FheUint1024;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint1024}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint1024;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint1024}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint1024;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint1024}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheUint1024;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint12 {
  free(): void;
/**
* @returns {FheUint12}
*/
  decompress(): FheUint12;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint12}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint12;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint12}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint12;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint12}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint12;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint128 {
  free(): void;
/**
* @returns {FheUint128}
*/
  decompress(): FheUint128;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint128}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint128;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint128}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint128;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint128}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheUint128;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint14 {
  free(): void;
/**
* @returns {FheUint14}
*/
  decompress(): FheUint14;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint14}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint14;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint14}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint14;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint14}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint14;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint16 {
  free(): void;
/**
* @returns {FheUint16}
*/
  decompress(): FheUint16;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint16}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint16;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint16}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint16;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint16}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint16;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint160 {
  free(): void;
/**
* @returns {FheUint160}
*/
  decompress(): FheUint160;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint160}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint160;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint160}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint160;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint160}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheUint160;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint2 {
  free(): void;
/**
* @returns {FheUint2}
*/
  decompress(): FheUint2;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint2}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint2;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint2}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint2;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint2}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint2;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint2048 {
  free(): void;
/**
* @returns {FheUint2048}
*/
  decompress(): FheUint2048;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint2048}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint2048;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint2048}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint2048;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint2048}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheUint2048;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint256 {
  free(): void;
/**
* @returns {FheUint256}
*/
  decompress(): FheUint256;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint256}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint256;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint256}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint256;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint256}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheUint256;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint32 {
  free(): void;
/**
* @returns {FheUint32}
*/
  decompress(): FheUint32;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint32}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint32;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint32}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint32;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint32}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint32;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint4 {
  free(): void;
/**
* @returns {FheUint4}
*/
  decompress(): FheUint4;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint4}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint4;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint4}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint4;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint4}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint4;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint512 {
  free(): void;
/**
* @returns {FheUint512}
*/
  decompress(): FheUint512;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint512}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint512;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint512}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint512;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint512}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheUint512;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint6 {
  free(): void;
/**
* @returns {FheUint6}
*/
  decompress(): FheUint6;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint6}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint6;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint6}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint6;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint6}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint6;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint64 {
  free(): void;
/**
* @returns {FheUint64}
*/
  decompress(): FheUint64;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint64}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint64;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint64}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint64;
/**
* @param {bigint} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint64}
*/
  static encrypt_with_client_key(value: bigint, client_key: TfheClientKey): CompressedFheUint64;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class CompressedFheUint8 {
  free(): void;
/**
* @returns {FheUint8}
*/
  decompress(): FheUint8;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint8}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint8;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint8}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint8;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint8}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint8;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheBool {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheBool}
*/
  static deserialize(buffer: Uint8Array): FheBool;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheBool}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheBool;
/**
* @param {boolean} value
* @param {TfheClientKey} client_key
* @returns {FheBool}
*/
  static encrypt_with_client_key(value: boolean, client_key: TfheClientKey): FheBool;
/**
* @param {boolean} value
* @param {TfhePublicKey} public_key
* @returns {FheBool}
*/
  static encrypt_with_public_key(value: boolean, public_key: TfhePublicKey): FheBool;
/**
* @param {boolean} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheBool}
*/
  static encrypt_with_compressed_public_key(value: boolean, compressed_public_key: TfheCompressedPublicKey): FheBool;
/**
* @param {TfheClientKey} client_key
* @returns {boolean}
*/
  decrypt(client_key: TfheClientKey): boolean;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt10 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt10}
*/
  static deserialize(buffer: Uint8Array): FheInt10;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt10}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt10;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheInt10}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt10;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheInt10}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt10;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt10}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt10;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt12 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt12}
*/
  static deserialize(buffer: Uint8Array): FheInt12;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt12}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt12;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheInt12}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt12;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheInt12}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt12;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt12}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt12;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt128 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt128}
*/
  static deserialize(buffer: Uint8Array): FheInt128;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt128}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt128;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {FheInt128}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheInt128;
/**
* @param {any} value
* @param {TfhePublicKey} public_key
* @returns {FheInt128}
*/
  static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheInt128;
/**
* @param {any} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt128}
*/
  static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheInt128;
/**
* @param {TfheClientKey} client_key
* @returns {any}
*/
  decrypt(client_key: TfheClientKey): any;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt14 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt14}
*/
  static deserialize(buffer: Uint8Array): FheInt14;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt14}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt14;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheInt14}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt14;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheInt14}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt14;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt14}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt14;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt16 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt16}
*/
  static deserialize(buffer: Uint8Array): FheInt16;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt16}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt16;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheInt16}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt16;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheInt16}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt16;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt16}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt16;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt160 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt160}
*/
  static deserialize(buffer: Uint8Array): FheInt160;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt160}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt160;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {FheInt160}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheInt160;
/**
* @param {any} value
* @param {TfhePublicKey} public_key
* @returns {FheInt160}
*/
  static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheInt160;
/**
* @param {any} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt160}
*/
  static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheInt160;
/**
* @param {TfheClientKey} client_key
* @returns {any}
*/
  decrypt(client_key: TfheClientKey): any;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt2 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt2}
*/
  static deserialize(buffer: Uint8Array): FheInt2;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt2}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt2;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheInt2}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt2;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheInt2}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt2;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt2}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt2;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt256 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt256}
*/
  static deserialize(buffer: Uint8Array): FheInt256;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt256}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt256;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {FheInt256}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheInt256;
/**
* @param {any} value
* @param {TfhePublicKey} public_key
* @returns {FheInt256}
*/
  static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheInt256;
/**
* @param {any} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt256}
*/
  static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheInt256;
/**
* @param {TfheClientKey} client_key
* @returns {any}
*/
  decrypt(client_key: TfheClientKey): any;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt32 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt32}
*/
  static deserialize(buffer: Uint8Array): FheInt32;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt32}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt32;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheInt32}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt32;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheInt32}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt32;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt32}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt32;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt4 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt4}
*/
  static deserialize(buffer: Uint8Array): FheInt4;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt4}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt4;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheInt4}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt4;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheInt4}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt4;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt4}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt4;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt6 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt6}
*/
  static deserialize(buffer: Uint8Array): FheInt6;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt6}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt6;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheInt6}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt6;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheInt6}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt6;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt6}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt6;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt64 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt64}
*/
  static deserialize(buffer: Uint8Array): FheInt64;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt64}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt64;
/**
* @param {bigint} value
* @param {TfheClientKey} client_key
* @returns {FheInt64}
*/
  static encrypt_with_client_key(value: bigint, client_key: TfheClientKey): FheInt64;
/**
* @param {bigint} value
* @param {TfhePublicKey} public_key
* @returns {FheInt64}
*/
  static encrypt_with_public_key(value: bigint, public_key: TfhePublicKey): FheInt64;
/**
* @param {bigint} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt64}
*/
  static encrypt_with_compressed_public_key(value: bigint, compressed_public_key: TfheCompressedPublicKey): FheInt64;
/**
* @param {TfheClientKey} client_key
* @returns {bigint}
*/
  decrypt(client_key: TfheClientKey): bigint;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheInt8 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheInt8}
*/
  static deserialize(buffer: Uint8Array): FheInt8;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheInt8}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt8;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheInt8}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt8;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheInt8}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt8;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheInt8}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt8;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint10 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint10}
*/
  static deserialize(buffer: Uint8Array): FheUint10;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint10}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint10;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheUint10}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint10;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheUint10}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint10;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint10}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint10;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint1024 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint1024}
*/
  static deserialize(buffer: Uint8Array): FheUint1024;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint1024}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint1024;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {FheUint1024}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheUint1024;
/**
* @param {any} value
* @param {TfhePublicKey} public_key
* @returns {FheUint1024}
*/
  static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheUint1024;
/**
* @param {any} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint1024}
*/
  static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheUint1024;
/**
* @param {TfheClientKey} client_key
* @returns {any}
*/
  decrypt(client_key: TfheClientKey): any;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint12 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint12}
*/
  static deserialize(buffer: Uint8Array): FheUint12;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint12}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint12;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheUint12}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint12;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheUint12}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint12;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint12}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint12;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint128 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint128}
*/
  static deserialize(buffer: Uint8Array): FheUint128;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint128}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint128;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {FheUint128}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheUint128;
/**
* @param {any} value
* @param {TfhePublicKey} public_key
* @returns {FheUint128}
*/
  static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheUint128;
/**
* @param {any} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint128}
*/
  static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheUint128;
/**
* @param {TfheClientKey} client_key
* @returns {any}
*/
  decrypt(client_key: TfheClientKey): any;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint14 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint14}
*/
  static deserialize(buffer: Uint8Array): FheUint14;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint14}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint14;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheUint14}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint14;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheUint14}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint14;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint14}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint14;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint16 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint16}
*/
  static deserialize(buffer: Uint8Array): FheUint16;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint16}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint16;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheUint16}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint16;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheUint16}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint16;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint16}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint16;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint160 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint160}
*/
  static deserialize(buffer: Uint8Array): FheUint160;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint160}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint160;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {FheUint160}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheUint160;
/**
* @param {any} value
* @param {TfhePublicKey} public_key
* @returns {FheUint160}
*/
  static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheUint160;
/**
* @param {any} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint160}
*/
  static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheUint160;
/**
* @param {TfheClientKey} client_key
* @returns {any}
*/
  decrypt(client_key: TfheClientKey): any;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint2 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint2}
*/
  static deserialize(buffer: Uint8Array): FheUint2;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint2}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint2;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheUint2}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint2;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheUint2}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint2;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint2}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint2;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint2048 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint2048}
*/
  static deserialize(buffer: Uint8Array): FheUint2048;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint2048}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint2048;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {FheUint2048}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheUint2048;
/**
* @param {any} value
* @param {TfhePublicKey} public_key
* @returns {FheUint2048}
*/
  static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheUint2048;
/**
* @param {any} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint2048}
*/
  static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheUint2048;
/**
* @param {TfheClientKey} client_key
* @returns {any}
*/
  decrypt(client_key: TfheClientKey): any;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint256 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint256}
*/
  static deserialize(buffer: Uint8Array): FheUint256;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint256}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint256;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {FheUint256}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheUint256;
/**
* @param {any} value
* @param {TfhePublicKey} public_key
* @returns {FheUint256}
*/
  static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheUint256;
/**
* @param {any} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint256}
*/
  static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheUint256;
/**
* @param {TfheClientKey} client_key
* @returns {any}
*/
  decrypt(client_key: TfheClientKey): any;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint32 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint32}
*/
  static deserialize(buffer: Uint8Array): FheUint32;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint32}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint32;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheUint32}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint32;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheUint32}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint32;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint32}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint32;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint4 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint4}
*/
  static deserialize(buffer: Uint8Array): FheUint4;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint4}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint4;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheUint4}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint4;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheUint4}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint4;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint4}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint4;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint512 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint512}
*/
  static deserialize(buffer: Uint8Array): FheUint512;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint512}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint512;
/**
* @param {any} value
* @param {TfheClientKey} client_key
* @returns {FheUint512}
*/
  static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheUint512;
/**
* @param {any} value
* @param {TfhePublicKey} public_key
* @returns {FheUint512}
*/
  static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheUint512;
/**
* @param {any} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint512}
*/
  static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheUint512;
/**
* @param {TfheClientKey} client_key
* @returns {any}
*/
  decrypt(client_key: TfheClientKey): any;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint6 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint6}
*/
  static deserialize(buffer: Uint8Array): FheUint6;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint6}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint6;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheUint6}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint6;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheUint6}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint6;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint6}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint6;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint64 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint64}
*/
  static deserialize(buffer: Uint8Array): FheUint64;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint64}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint64;
/**
* @param {bigint} value
* @param {TfheClientKey} client_key
* @returns {FheUint64}
*/
  static encrypt_with_client_key(value: bigint, client_key: TfheClientKey): FheUint64;
/**
* @param {bigint} value
* @param {TfhePublicKey} public_key
* @returns {FheUint64}
*/
  static encrypt_with_public_key(value: bigint, public_key: TfhePublicKey): FheUint64;
/**
* @param {bigint} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint64}
*/
  static encrypt_with_compressed_public_key(value: bigint, compressed_public_key: TfheCompressedPublicKey): FheUint64;
/**
* @param {TfheClientKey} client_key
* @returns {bigint}
*/
  decrypt(client_key: TfheClientKey): bigint;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint8 {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {FheUint8}
*/
  static deserialize(buffer: Uint8Array): FheUint8;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {FheUint8}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint8;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {FheUint8}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint8;
/**
* @param {number} value
* @param {TfhePublicKey} public_key
* @returns {FheUint8}
*/
  static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint8;
/**
* @param {number} value
* @param {TfheCompressedPublicKey} compressed_public_key
* @returns {FheUint8}
*/
  static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint8;
/**
* @param {TfheClientKey} client_key
* @returns {number}
*/
  decrypt(client_key: TfheClientKey): number;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
* Encrypted bet data for JavaScript
*/
export class JsEncryptedBet {
  free(): void;
/**
* Encrypted amount (serialized FheUint64)
*/
  amount: Uint8Array;
/**
* SHA3-256 commitment hash (32 bytes)
*/
  commitment: Uint8Array;
/**
* Random nonce for commitment (32 bytes)
*/
  nonce: Uint8Array;
/**
* Encrypted outcome (serialized FheUint8)
*/
  outcome: Uint8Array;
}
/**
*/
export class Shortint {
  free(): void;
/**
* @param {number} message_bits
* @param {number} carry_bits
* @returns {ShortintParameters}
*/
  static get_parameters(message_bits: number, carry_bits: number): ShortintParameters;
/**
* @param {ShortintParameters} parameters
* @returns {ShortintClientKey}
*/
  static new_client_key(parameters: ShortintParameters): ShortintClientKey;
/**
* @param {number} lwe_dimension
* @param {number} glwe_dimension
* @param {number} polynomial_size
* @param {ShortintNoiseDistribution} lwe_noise_distribution
* @param {ShortintNoiseDistribution} glwe_noise_distribution
* @param {number} pbs_base_log
* @param {number} pbs_level
* @param {number} ks_base_log
* @param {number} ks_level
* @param {number} message_modulus
* @param {number} carry_modulus
* @param {number} max_noise_level
* @param {number} log2_p_fail
* @param {number} modulus_power_of_2_exponent
* @param {ShortintEncryptionKeyChoice} encryption_key_choice
* @returns {ShortintParameters}
*/
  static new_parameters(lwe_dimension: number, glwe_dimension: number, polynomial_size: number, lwe_noise_distribution: ShortintNoiseDistribution, glwe_noise_distribution: ShortintNoiseDistribution, pbs_base_log: number, pbs_level: number, ks_base_log: number, ks_level: number, message_modulus: number, carry_modulus: number, max_noise_level: number, log2_p_fail: number, modulus_power_of_2_exponent: number, encryption_key_choice: ShortintEncryptionKeyChoice): ShortintParameters;
/**
* @param {ShortintClientKey} client_key
* @returns {ShortintPublicKey}
*/
  static new_public_key(client_key: ShortintClientKey): ShortintPublicKey;
/**
* @param {number} bound_log2
* @returns {ShortintNoiseDistribution}
*/
  static try_new_t_uniform(bound_log2: number): ShortintNoiseDistribution;
/**
* @param {ShortintClientKey} client_key
* @param {bigint} message
* @returns {ShortintCompressedCiphertext}
*/
  static encrypt_compressed(client_key: ShortintClientKey, message: bigint): ShortintCompressedCiphertext;
/**
* @param {number} message_bits
* @param {number} carry_bits
* @returns {ShortintParameters}
*/
  static get_parameters_small(message_bits: number, carry_bits: number): ShortintParameters;
/**
* @param {ShortintCiphertext} ciphertext
* @returns {Uint8Array}
*/
  static serialize_ciphertext(ciphertext: ShortintCiphertext): Uint8Array;
/**
* @param {ShortintClientKey} client_key
* @returns {Uint8Array}
*/
  static serialize_client_key(client_key: ShortintClientKey): Uint8Array;
/**
* @param {ShortintPublicKey} public_key
* @returns {Uint8Array}
*/
  static serialize_public_key(public_key: ShortintPublicKey): Uint8Array;
/**
* @param {ShortintCompressedCiphertext} compressed_ciphertext
* @returns {ShortintCiphertext}
*/
  static decompress_ciphertext(compressed_ciphertext: ShortintCompressedCiphertext): ShortintCiphertext;
/**
* @param {Uint8Array} buffer
* @returns {ShortintCiphertext}
*/
  static deserialize_ciphertext(buffer: Uint8Array): ShortintCiphertext;
/**
* @param {Uint8Array} buffer
* @returns {ShortintClientKey}
*/
  static deserialize_client_key(buffer: Uint8Array): ShortintClientKey;
/**
* @param {Uint8Array} buffer
* @returns {ShortintPublicKey}
*/
  static deserialize_public_key(buffer: Uint8Array): ShortintPublicKey;
/**
* @param {ShortintPublicKey} public_key
* @param {bigint} message
* @returns {ShortintCiphertext}
*/
  static encrypt_with_public_key(public_key: ShortintPublicKey, message: bigint): ShortintCiphertext;
/**
* @param {ShortintClientKey} client_key
* @returns {ShortintCompressedPublicKey}
*/
  static new_compressed_public_key(client_key: ShortintClientKey): ShortintCompressedPublicKey;
/**
* @param {ShortintClientKey} client_key
* @returns {ShortintCompressedServerKey}
*/
  static new_compressed_server_key(client_key: ShortintClientKey): ShortintCompressedServerKey;
/**
* @param {number} std_dev
* @returns {ShortintNoiseDistribution}
*/
  static new_gaussian_from_std_dev(std_dev: number): ShortintNoiseDistribution;
/**
* @param {ShortintCompressedCiphertext} ciphertext
* @returns {Uint8Array}
*/
  static serialize_compressed_ciphertext(ciphertext: ShortintCompressedCiphertext): Uint8Array;
/**
* @param {ShortintCompressedPublicKey} public_key
* @returns {Uint8Array}
*/
  static serialize_compressed_public_key(public_key: ShortintCompressedPublicKey): Uint8Array;
/**
* @param {ShortintCompressedServerKey} server_key
* @returns {Uint8Array}
*/
  static serialize_compressed_server_key(server_key: ShortintCompressedServerKey): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {ShortintCompressedCiphertext}
*/
  static deserialize_compressed_ciphertext(buffer: Uint8Array): ShortintCompressedCiphertext;
/**
* @param {Uint8Array} buffer
* @returns {ShortintCompressedPublicKey}
*/
  static deserialize_compressed_public_key(buffer: Uint8Array): ShortintCompressedPublicKey;
/**
* @param {Uint8Array} buffer
* @returns {ShortintCompressedServerKey}
*/
  static deserialize_compressed_server_key(buffer: Uint8Array): ShortintCompressedServerKey;
/**
* @param {ShortintCompressedPublicKey} public_key
* @param {bigint} message
* @returns {ShortintCiphertext}
*/
  static encrypt_with_compressed_public_key(public_key: ShortintCompressedPublicKey, message: bigint): ShortintCiphertext;
/**
* @param {bigint} seed_high_bytes
* @param {bigint} seed_low_bytes
* @param {ShortintParameters} parameters
* @returns {ShortintClientKey}
*/
  static new_client_key_from_seed_and_parameters(seed_high_bytes: bigint, seed_low_bytes: bigint, parameters: ShortintParameters): ShortintClientKey;
/**
* @param {ShortintClientKey} client_key
* @param {ShortintCiphertext} ct
* @returns {bigint}
*/
  static decrypt(client_key: ShortintClientKey, ct: ShortintCiphertext): bigint;
/**
* @param {ShortintClientKey} client_key
* @param {bigint} message
* @returns {ShortintCiphertext}
*/
  static encrypt(client_key: ShortintClientKey, message: bigint): ShortintCiphertext;
}
/**
*/
export class ShortintCiphertext {
  free(): void;
}
/**
*/
export class ShortintClientKey {
  free(): void;
}
/**
*/
export class ShortintCompactPublicKeyEncryptionParameters {
  free(): void;
/**
* @param {number} encryption_lwe_dimension
* @param {ShortintNoiseDistribution} encryption_noise_distribution
* @param {number} message_modulus
* @param {number} carry_modulus
* @param {number} modulus_power_of_2_exponent
* @param {number} ks_base_log
* @param {number} ks_level
* @param {ShortintEncryptionKeyChoice} encryption_key_choice
* @returns {ShortintCompactPublicKeyEncryptionParameters}
*/
  static new_parameters(encryption_lwe_dimension: number, encryption_noise_distribution: ShortintNoiseDistribution, message_modulus: number, carry_modulus: number, modulus_power_of_2_exponent: number, ks_base_log: number, ks_level: number, encryption_key_choice: ShortintEncryptionKeyChoice): ShortintCompactPublicKeyEncryptionParameters;
/**
* @param {ShortintCompactPublicKeyEncryptionParametersName} name
*/
  constructor(name: ShortintCompactPublicKeyEncryptionParametersName);
}
/**
*/
export class ShortintCompressedCiphertext {
  free(): void;
}
/**
*/
export class ShortintCompressedPublicKey {
  free(): void;
}
/**
*/
export class ShortintCompressedServerKey {
  free(): void;
}
/**
*/
export class ShortintNoiseDistribution {
  free(): void;
}
/**
*/
export class ShortintParameters {
  free(): void;
/**
* @returns {number}
*/
  ks_base_log(): number;
/**
* @returns {number}
*/
  pbs_base_log(): number;
/**
* @param {number} new_value
*/
  set_ks_level(new_value: number): void;
/**
* @returns {number}
*/
  carry_modulus(): number;
/**
* @returns {number}
*/
  lwe_dimension(): number;
/**
* @param {number} new_value
*/
  set_pbs_level(new_value: number): void;
/**
* @returns {number}
*/
  glwe_dimension(): number;
/**
* @returns {number}
*/
  message_modulus(): number;
/**
* @returns {number}
*/
  polynomial_size(): number;
/**
* @param {number} new_value
*/
  set_ks_base_log(new_value: number): void;
/**
* @param {number} new_value
*/
  set_pbs_base_log(new_value: number): void;
/**
* @param {number} new_value
*/
  set_carry_modulus(new_value: number): void;
/**
* @param {number} new_value
*/
  set_lwe_dimension(new_value: number): void;
/**
* @param {number} new_value
*/
  set_glwe_dimension(new_value: number): void;
/**
* @param {number} new_value
*/
  set_message_modulus(new_value: number): void;
/**
* @param {number} new_value
*/
  set_polynomial_size(new_value: number): void;
/**
* @returns {ShortintEncryptionKeyChoice}
*/
  encryption_key_choice(): ShortintEncryptionKeyChoice;
/**
* @returns {ShortintNoiseDistribution}
*/
  lwe_noise_distribution(): ShortintNoiseDistribution;
/**
* @returns {ShortintNoiseDistribution}
*/
  glwe_noise_distribution(): ShortintNoiseDistribution;
/**
* @param {ShortintEncryptionKeyChoice} new_value
*/
  set_encryption_key_choice(new_value: ShortintEncryptionKeyChoice): void;
/**
* @param {ShortintNoiseDistribution} new_value
*/
  set_lwe_noise_distribution(new_value: ShortintNoiseDistribution): void;
/**
* @param {ShortintNoiseDistribution} new_value
*/
  set_glwe_noise_distribution(new_value: ShortintNoiseDistribution): void;
/**
* @param {ShortintParametersName} name
*/
  constructor(name: ShortintParametersName);
/**
* @returns {number}
*/
  ks_level(): number;
/**
* @returns {number}
*/
  pbs_level(): number;
}
/**
*/
export class ShortintPublicKey {
  free(): void;
}
/**
*/
export class TfheClientKey {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {TfheClientKey}
*/
  static deserialize(buffer: Uint8Array): TfheClientKey;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {TfheClientKey}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): TfheClientKey;
/**
* @param {TfheConfig} config
* @param {any} seed
* @returns {TfheClientKey}
*/
  static generate_with_seed(config: TfheConfig, seed: any): TfheClientKey;
/**
* @param {TfheConfig} config
* @returns {TfheClientKey}
*/
  static generate(config: TfheConfig): TfheClientKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class TfheCompactPublicKey {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {TfheCompactPublicKey}
*/
  static deserialize(buffer: Uint8Array): TfheCompactPublicKey;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {TfheCompactPublicKey}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): TfheCompactPublicKey;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @param {ShortintCompactPublicKeyEncryptionParameters} conformance_params
* @returns {TfheCompactPublicKey}
*/
  static safe_deserialize_conformant(buffer: Uint8Array, serialized_size_limit: bigint, conformance_params: ShortintCompactPublicKeyEncryptionParameters): TfheCompactPublicKey;
/**
* @param {TfheClientKey} client_key
* @returns {TfheCompactPublicKey}
*/
  static new(client_key: TfheClientKey): TfheCompactPublicKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class TfheCompressedCompactPublicKey {
  free(): void;
/**
* @returns {TfheCompactPublicKey}
*/
  decompress(): TfheCompactPublicKey;
/**
* @param {Uint8Array} buffer
* @returns {TfheCompressedCompactPublicKey}
*/
  static deserialize(buffer: Uint8Array): TfheCompressedCompactPublicKey;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {TfheCompressedCompactPublicKey}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): TfheCompressedCompactPublicKey;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @param {ShortintCompactPublicKeyEncryptionParameters} conformance_params
* @returns {TfheCompressedCompactPublicKey}
*/
  static safe_deserialize_conformant(buffer: Uint8Array, serialized_size_limit: bigint, conformance_params: ShortintCompactPublicKeyEncryptionParameters): TfheCompressedCompactPublicKey;
/**
* @param {TfheClientKey} client_key
* @returns {TfheCompressedCompactPublicKey}
*/
  static new(client_key: TfheClientKey): TfheCompressedCompactPublicKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class TfheCompressedPublicKey {
  free(): void;
/**
* @returns {TfhePublicKey}
*/
  decompress(): TfhePublicKey;
/**
* @param {Uint8Array} buffer
* @returns {TfheCompressedPublicKey}
*/
  static deserialize(buffer: Uint8Array): TfheCompressedPublicKey;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {TfheCompressedPublicKey}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): TfheCompressedPublicKey;
/**
* @param {TfheClientKey} client_key
* @returns {TfheCompressedPublicKey}
*/
  static new(client_key: TfheClientKey): TfheCompressedPublicKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class TfheCompressedServerKey {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {TfheCompressedServerKey}
*/
  static deserialize(buffer: Uint8Array): TfheCompressedServerKey;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {TfheCompressedServerKey}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): TfheCompressedServerKey;
/**
* @param {TfheClientKey} client_key
* @returns {TfheCompressedServerKey}
*/
  static new(client_key: TfheClientKey): TfheCompressedServerKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class TfheConfig {
  free(): void;
}
/**
*/
export class TfheConfigBuilder {
  free(): void;
/**
* @param {ShortintParameters} block_parameters
* @returns {TfheConfigBuilder}
*/
  use_custom_parameters(block_parameters: ShortintParameters): TfheConfigBuilder;
/**
* @returns {TfheConfigBuilder}
*/
  static default_with_big_encryption(): TfheConfigBuilder;
/**
* @returns {TfheConfigBuilder}
*/
  static default_with_small_encryption(): TfheConfigBuilder;
/**
* @param {ShortintCompactPublicKeyEncryptionParameters} compact_public_key_parameters
* @returns {TfheConfigBuilder}
*/
  use_dedicated_compact_public_key_parameters(compact_public_key_parameters: ShortintCompactPublicKeyEncryptionParameters): TfheConfigBuilder;
/**
* @returns {TfheConfig}
*/
  build(): TfheConfig;
/**
* @returns {TfheConfigBuilder}
*/
  static default(): TfheConfigBuilder;
}
/**
*/
export class TfhePublicKey {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {TfhePublicKey}
*/
  static deserialize(buffer: Uint8Array): TfhePublicKey;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {TfhePublicKey}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): TfhePublicKey;
/**
* @param {TfheClientKey} client_key
* @returns {TfhePublicKey}
*/
  static new(client_key: TfheClientKey): TfhePublicKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class TfheServerKey {
  free(): void;
/**
* @param {TfheClientKey} client_key
* @returns {TfheServerKey}
*/
  static new(client_key: TfheClientKey): TfheServerKey;
}
/**
* WASM wrapper for FheKeyPair
*/
export class WasmFheClient {
  free(): void;
/**
* Load keypair from stored bytes
*
* # Example (JavaScript)
* ```javascript
* const client = WasmFheClient.from_bytes(clientKeyBytes, serverKeyBytes);
* ```
* @param {Uint8Array} client_bytes
* @param {Uint8Array} server_bytes
* @returns {WasmFheClient}
*/
  static from_bytes(client_bytes: Uint8Array, server_bytes: Uint8Array): WasmFheClient;
/**
* Encrypt a bet
*
* # Arguments
* * `outcome_yes` - true for YES, false for NO
* * `amount_piconeros` - Bet amount in piconeros (1 XMR = 1e12 piconeros)
*
* # Example (JavaScript)
* ```javascript
* const encryptedBet = client.encrypt_bet(true, 1000000000000n); // 1 XMR on YES
* ```
* @param {boolean} outcome_yes
* @param {bigint} amount_piconeros
* @returns {JsEncryptedBet}
*/
  encrypt_bet(outcome_yes: boolean, amount_piconeros: bigint): JsEncryptedBet;
/**
* Decrypt amount (for testing/verification only)
* @param {Uint8Array} ciphertext
* @returns {bigint}
*/
  decrypt_amount(ciphertext: Uint8Array): bigint;
/**
* Decrypt outcome (for testing/verification only)
* @param {Uint8Array} ciphertext
* @returns {boolean}
*/
  decrypt_outcome(ciphertext: Uint8Array): boolean;
/**
* Export client key (PRIVATE - never share!)
*
* # Example (JavaScript)
* ```javascript
* const clientKeyBytes = client.export_client_key();
* // Store securely in IndexedDB, encrypted
* ```
* @returns {Uint8Array}
*/
  export_client_key(): Uint8Array;
/**
* Export server key (PUBLIC - safe to send to coordinator)
*
* # Example (JavaScript)
* ```javascript
* const serverKeyBytes = client.export_server_key();
* // Send to coordinator via POST /register
* ```
* @returns {Uint8Array}
*/
  export_server_key(): Uint8Array;
/**
* Generate new FHE keypair
*
* ⚠️ Warning: This takes 10-30 seconds! Show a progress indicator.
*
* # Example (JavaScript)
* ```javascript
* const client = new WasmFheClient();
* ```
*/
  constructor();
}
/**
*/
export class tfhe {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_get_jsencryptedbet_amount: (a: number, b: number) => void;
  readonly __wbg_get_jsencryptedbet_commitment: (a: number, b: number) => void;
  readonly __wbg_get_jsencryptedbet_nonce: (a: number, b: number) => void;
  readonly __wbg_get_jsencryptedbet_outcome: (a: number, b: number) => void;
  readonly __wbg_jsencryptedbet_free: (a: number, b: number) => void;
  readonly __wbg_set_jsencryptedbet_amount: (a: number, b: number, c: number) => void;
  readonly __wbg_set_jsencryptedbet_commitment: (a: number, b: number, c: number) => void;
  readonly __wbg_set_jsencryptedbet_nonce: (a: number, b: number, c: number) => void;
  readonly __wbg_set_jsencryptedbet_outcome: (a: number, b: number, c: number) => void;
  readonly __wbg_wasmfheclient_free: (a: number, b: number) => void;
  readonly wasmfheclient_decrypt_amount: (a: number, b: number, c: number, d: number) => void;
  readonly wasmfheclient_decrypt_outcome: (a: number, b: number, c: number, d: number) => void;
  readonly wasmfheclient_encrypt_bet: (a: number, b: number, c: number, d: number) => void;
  readonly wasmfheclient_export_client_key: (a: number, b: number) => void;
  readonly wasmfheclient_export_server_key: (a: number, b: number) => void;
  readonly wasmfheclient_from_bytes: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wasmfheclient_generate: (a: number) => void;
  readonly __wbg_tfhe_free: (a: number, b: number) => void;
  readonly __wbg_shortint_free: (a: number, b: number) => void;
  readonly __wbg_shortintciphertext_free: (a: number, b: number) => void;
  readonly __wbg_shortintclientkey_free: (a: number, b: number) => void;
  readonly __wbg_shortintcompactpublickeyencryptionparameters_free: (a: number, b: number) => void;
  readonly __wbg_shortintcompressedciphertext_free: (a: number, b: number) => void;
  readonly __wbg_shortintcompressedpublickey_free: (a: number, b: number) => void;
  readonly __wbg_shortintcompressedserverkey_free: (a: number, b: number) => void;
  readonly __wbg_shortintnoisedistribution_free: (a: number, b: number) => void;
  readonly __wbg_shortintparameters_free: (a: number, b: number) => void;
  readonly __wbg_shortintpublickey_free: (a: number, b: number) => void;
  readonly __wbg_tfheclientkey_free: (a: number, b: number) => void;
  readonly __wbg_tfhecompactpublickey_free: (a: number, b: number) => void;
  readonly __wbg_tfhecompressedcompactpublickey_free: (a: number, b: number) => void;
  readonly __wbg_tfhecompressedpublickey_free: (a: number, b: number) => void;
  readonly __wbg_tfhecompressedserverkey_free: (a: number, b: number) => void;
  readonly __wbg_tfheconfig_free: (a: number, b: number) => void;
  readonly __wbg_tfheconfigbuilder_free: (a: number, b: number) => void;
  readonly __wbg_tfhepublickey_free: (a: number, b: number) => void;
  readonly __wbg_tfheserverkey_free: (a: number, b: number) => void;
  readonly init_panic_hook: () => void;
  readonly set_server_key: (a: number, b: number) => void;
  readonly shortint_decompress_ciphertext: (a: number) => number;
  readonly shortint_decrypt: (a: number, b: number) => number;
  readonly shortint_deserialize_ciphertext: (a: number, b: number, c: number) => void;
  readonly shortint_deserialize_client_key: (a: number, b: number, c: number) => void;
  readonly shortint_deserialize_compressed_ciphertext: (a: number, b: number, c: number) => void;
  readonly shortint_deserialize_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly shortint_deserialize_compressed_server_key: (a: number, b: number, c: number) => void;
  readonly shortint_deserialize_public_key: (a: number, b: number, c: number) => void;
  readonly shortint_encrypt: (a: number, b: number) => number;
  readonly shortint_encrypt_compressed: (a: number, b: number) => number;
  readonly shortint_encrypt_with_compressed_public_key: (a: number, b: number) => number;
  readonly shortint_encrypt_with_public_key: (a: number, b: number) => number;
  readonly shortint_get_parameters: (a: number, b: number, c: number) => void;
  readonly shortint_get_parameters_small: (a: number, b: number, c: number) => void;
  readonly shortint_new_client_key: (a: number) => number;
  readonly shortint_new_client_key_from_seed_and_parameters: (a: number, b: number, c: number) => number;
  readonly shortint_new_compressed_public_key: (a: number) => number;
  readonly shortint_new_compressed_server_key: (a: number) => number;
  readonly shortint_new_gaussian_from_std_dev: (a: number) => number;
  readonly shortint_new_parameters: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number) => number;
  readonly shortint_new_public_key: (a: number) => number;
  readonly shortint_serialize_ciphertext: (a: number, b: number) => void;
  readonly shortint_serialize_client_key: (a: number, b: number) => void;
  readonly shortint_serialize_compressed_ciphertext: (a: number, b: number) => void;
  readonly shortint_serialize_compressed_public_key: (a: number, b: number) => void;
  readonly shortint_serialize_compressed_server_key: (a: number, b: number) => void;
  readonly shortint_serialize_public_key: (a: number, b: number) => void;
  readonly shortint_try_new_t_uniform: (a: number, b: number) => void;
  readonly shortintcompactpublickeyencryptionparameters_new: (a: number) => number;
  readonly shortintcompactpublickeyencryptionparameters_new_parameters: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly shortintparameters_carry_modulus: (a: number) => number;
  readonly shortintparameters_encryption_key_choice: (a: number) => number;
  readonly shortintparameters_glwe_dimension: (a: number) => number;
  readonly shortintparameters_glwe_noise_distribution: (a: number) => number;
  readonly shortintparameters_ks_base_log: (a: number) => number;
  readonly shortintparameters_ks_level: (a: number) => number;
  readonly shortintparameters_lwe_dimension: (a: number) => number;
  readonly shortintparameters_message_modulus: (a: number) => number;
  readonly shortintparameters_new: (a: number) => number;
  readonly shortintparameters_pbs_base_log: (a: number) => number;
  readonly shortintparameters_pbs_level: (a: number) => number;
  readonly shortintparameters_polynomial_size: (a: number) => number;
  readonly shortintparameters_set_carry_modulus: (a: number, b: number) => void;
  readonly shortintparameters_set_encryption_key_choice: (a: number, b: number) => void;
  readonly shortintparameters_set_glwe_dimension: (a: number, b: number) => void;
  readonly shortintparameters_set_glwe_noise_distribution: (a: number, b: number) => void;
  readonly shortintparameters_set_ks_base_log: (a: number, b: number) => void;
  readonly shortintparameters_set_ks_level: (a: number, b: number) => void;
  readonly shortintparameters_set_lwe_dimension: (a: number, b: number) => void;
  readonly shortintparameters_set_lwe_noise_distribution: (a: number, b: number) => void;
  readonly shortintparameters_set_message_modulus: (a: number, b: number) => void;
  readonly shortintparameters_set_pbs_base_log: (a: number, b: number) => void;
  readonly shortintparameters_set_pbs_level: (a: number, b: number) => void;
  readonly shortintparameters_set_polynomial_size: (a: number, b: number) => void;
  readonly tfheclientkey_deserialize: (a: number, b: number, c: number) => void;
  readonly tfheclientkey_generate: (a: number, b: number) => void;
  readonly tfheclientkey_generate_with_seed: (a: number, b: number, c: number) => void;
  readonly tfheclientkey_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly tfheclientkey_safe_serialize: (a: number, b: number, c: number) => void;
  readonly tfheclientkey_serialize: (a: number, b: number) => void;
  readonly tfhecompactpublickey_deserialize: (a: number, b: number, c: number) => void;
  readonly tfhecompactpublickey_new: (a: number, b: number) => void;
  readonly tfhecompactpublickey_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly tfhecompactpublickey_safe_deserialize_conformant: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly tfhecompactpublickey_safe_serialize: (a: number, b: number, c: number) => void;
  readonly tfhecompactpublickey_serialize: (a: number, b: number) => void;
  readonly tfhecompressedcompactpublickey_decompress: (a: number, b: number) => void;
  readonly tfhecompressedcompactpublickey_deserialize: (a: number, b: number, c: number) => void;
  readonly tfhecompressedcompactpublickey_new: (a: number, b: number) => void;
  readonly tfhecompressedcompactpublickey_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly tfhecompressedcompactpublickey_safe_deserialize_conformant: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly tfhecompressedcompactpublickey_safe_serialize: (a: number, b: number, c: number) => void;
  readonly tfhecompressedcompactpublickey_serialize: (a: number, b: number) => void;
  readonly tfhecompressedpublickey_decompress: (a: number, b: number) => void;
  readonly tfhecompressedpublickey_deserialize: (a: number, b: number, c: number) => void;
  readonly tfhecompressedpublickey_new: (a: number, b: number) => void;
  readonly tfhecompressedpublickey_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly tfhecompressedpublickey_safe_serialize: (a: number, b: number, c: number) => void;
  readonly tfhecompressedpublickey_serialize: (a: number, b: number) => void;
  readonly tfhecompressedserverkey_deserialize: (a: number, b: number, c: number) => void;
  readonly tfhecompressedserverkey_new: (a: number, b: number) => void;
  readonly tfhecompressedserverkey_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly tfhecompressedserverkey_safe_serialize: (a: number, b: number, c: number) => void;
  readonly tfhecompressedserverkey_serialize: (a: number, b: number) => void;
  readonly tfheconfigbuilder_build: (a: number) => number;
  readonly tfheconfigbuilder_default: () => number;
  readonly tfheconfigbuilder_default_with_small_encryption: () => number;
  readonly tfheconfigbuilder_use_custom_parameters: (a: number, b: number) => number;
  readonly tfheconfigbuilder_use_dedicated_compact_public_key_parameters: (a: number, b: number) => number;
  readonly tfhepublickey_deserialize: (a: number, b: number, c: number) => void;
  readonly tfhepublickey_new: (a: number, b: number) => void;
  readonly tfhepublickey_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly tfhepublickey_safe_serialize: (a: number, b: number, c: number) => void;
  readonly tfhepublickey_serialize: (a: number, b: number) => void;
  readonly tfheserverkey_new: (a: number, b: number) => void;
  readonly shortintparameters_lwe_noise_distribution: (a: number) => number;
  readonly tfheconfigbuilder_default_with_big_encryption: () => number;
  readonly __wbg_compactciphertextlist_free: (a: number, b: number) => void;
  readonly __wbg_compactciphertextlistbuilder_free: (a: number, b: number) => void;
  readonly __wbg_compactciphertextlistexpander_free: (a: number, b: number) => void;
  readonly __wbg_compressedfhebool_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint10_free: (a: number, b: number) => void;
  readonly __wbg_fhebool_free: (a: number, b: number) => void;
  readonly __wbg_fheint10_free: (a: number, b: number) => void;
  readonly __wbg_fheint160_free: (a: number, b: number) => void;
  readonly compactciphertextlist_builder: (a: number, b: number) => void;
  readonly compactciphertextlist_deserialize: (a: number, b: number, c: number) => void;
  readonly compactciphertextlist_expand: (a: number, b: number) => void;
  readonly compactciphertextlist_get_kind_of: (a: number, b: number) => number;
  readonly compactciphertextlist_is_empty: (a: number) => number;
  readonly compactciphertextlist_len: (a: number) => number;
  readonly compactciphertextlist_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compactciphertextlist_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compactciphertextlist_serialize: (a: number, b: number) => void;
  readonly compactciphertextlistbuilder_build: (a: number, b: number) => void;
  readonly compactciphertextlistbuilder_build_packed: (a: number, b: number) => void;
  readonly compactciphertextlistbuilder_push_boolean: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i10: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i12: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i128: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i14: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i16: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i160: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i2: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i256: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i32: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i4: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i6: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i64: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_i8: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u10: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u1024: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u12: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u128: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u14: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u16: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u160: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u2: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u2048: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u256: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u32: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u4: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u512: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u6: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u64: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistbuilder_push_u8: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_bool: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int10: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int12: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int128: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int14: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int16: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int160: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int2: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int256: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int32: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int4: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int6: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int64: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_int8: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_kind_of: (a: number, b: number) => number;
  readonly compactciphertextlistexpander_get_uint10: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint1024: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint12: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint128: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint14: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint16: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint160: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint2: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint2048: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint256: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint32: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint4: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint512: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint6: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint64: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_get_uint8: (a: number, b: number, c: number) => void;
  readonly compactciphertextlistexpander_is_empty: (a: number) => number;
  readonly compactciphertextlistexpander_len: (a: number) => number;
  readonly compressedfhebool_decompress: (a: number, b: number) => void;
  readonly compressedfhebool_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfhebool_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfhebool_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfhebool_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfhebool_serialize: (a: number, b: number) => void;
  readonly compressedfheint10_decompress: (a: number, b: number) => void;
  readonly compressedfheint10_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint10_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint10_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint10_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint10_serialize: (a: number, b: number) => void;
  readonly compressedfheint128_decompress: (a: number, b: number) => void;
  readonly compressedfheint128_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint128_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint128_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint128_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint128_serialize: (a: number, b: number) => void;
  readonly compressedfheint12_decompress: (a: number, b: number) => void;
  readonly compressedfheint12_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint12_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint12_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint12_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint12_serialize: (a: number, b: number) => void;
  readonly compressedfheint14_decompress: (a: number, b: number) => void;
  readonly compressedfheint14_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint14_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint14_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint14_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint14_serialize: (a: number, b: number) => void;
  readonly compressedfheint160_decompress: (a: number, b: number) => void;
  readonly compressedfheint160_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint160_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint160_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint160_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint160_serialize: (a: number, b: number) => void;
  readonly compressedfheint16_decompress: (a: number, b: number) => void;
  readonly compressedfheint16_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint16_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint16_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint16_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint16_serialize: (a: number, b: number) => void;
  readonly compressedfheint256_decompress: (a: number, b: number) => void;
  readonly compressedfheint256_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint256_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint256_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint256_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint256_serialize: (a: number, b: number) => void;
  readonly compressedfheint2_decompress: (a: number, b: number) => void;
  readonly compressedfheint2_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint2_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint2_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint2_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint2_serialize: (a: number, b: number) => void;
  readonly compressedfheint32_decompress: (a: number, b: number) => void;
  readonly compressedfheint32_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint32_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint32_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint32_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint32_serialize: (a: number, b: number) => void;
  readonly compressedfheint4_decompress: (a: number, b: number) => void;
  readonly compressedfheint4_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint4_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint4_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint4_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint4_serialize: (a: number, b: number) => void;
  readonly compressedfheint64_decompress: (a: number, b: number) => void;
  readonly compressedfheint64_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint64_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint64_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint64_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint64_serialize: (a: number, b: number) => void;
  readonly compressedfheint6_decompress: (a: number, b: number) => void;
  readonly compressedfheint6_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint6_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint6_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint6_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint6_serialize: (a: number, b: number) => void;
  readonly compressedfheint8_decompress: (a: number, b: number) => void;
  readonly compressedfheint8_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint8_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheint8_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheint8_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheint8_serialize: (a: number, b: number) => void;
  readonly compressedfheuint1024_decompress: (a: number, b: number) => void;
  readonly compressedfheuint1024_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint1024_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint1024_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint1024_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint1024_serialize: (a: number, b: number) => void;
  readonly compressedfheuint10_decompress: (a: number, b: number) => void;
  readonly compressedfheuint10_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint10_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint10_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint10_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint10_serialize: (a: number, b: number) => void;
  readonly compressedfheuint128_decompress: (a: number, b: number) => void;
  readonly compressedfheuint128_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint128_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint128_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint128_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint128_serialize: (a: number, b: number) => void;
  readonly compressedfheuint12_decompress: (a: number, b: number) => void;
  readonly compressedfheuint12_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint12_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint12_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint12_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint12_serialize: (a: number, b: number) => void;
  readonly compressedfheuint14_decompress: (a: number, b: number) => void;
  readonly compressedfheuint14_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint14_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint14_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint14_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint14_serialize: (a: number, b: number) => void;
  readonly compressedfheuint160_decompress: (a: number, b: number) => void;
  readonly compressedfheuint160_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint160_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint160_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint160_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint160_serialize: (a: number, b: number) => void;
  readonly compressedfheuint16_decompress: (a: number, b: number) => void;
  readonly compressedfheuint16_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint16_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint16_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint16_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint16_serialize: (a: number, b: number) => void;
  readonly compressedfheuint2048_decompress: (a: number, b: number) => void;
  readonly compressedfheuint2048_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint2048_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint2048_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint2048_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint2048_serialize: (a: number, b: number) => void;
  readonly compressedfheuint256_decompress: (a: number, b: number) => void;
  readonly compressedfheuint256_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint256_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint256_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint256_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint256_serialize: (a: number, b: number) => void;
  readonly compressedfheuint2_decompress: (a: number, b: number) => void;
  readonly compressedfheuint2_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint2_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint2_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint2_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint2_serialize: (a: number, b: number) => void;
  readonly compressedfheuint32_decompress: (a: number, b: number) => void;
  readonly compressedfheuint32_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint32_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint32_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint32_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint32_serialize: (a: number, b: number) => void;
  readonly compressedfheuint4_decompress: (a: number, b: number) => void;
  readonly compressedfheuint4_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint4_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint4_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint4_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint4_serialize: (a: number, b: number) => void;
  readonly compressedfheuint512_decompress: (a: number, b: number) => void;
  readonly compressedfheuint512_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint512_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint512_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint512_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint512_serialize: (a: number, b: number) => void;
  readonly compressedfheuint64_decompress: (a: number, b: number) => void;
  readonly compressedfheuint64_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint64_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint64_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint64_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint64_serialize: (a: number, b: number) => void;
  readonly compressedfheuint6_decompress: (a: number, b: number) => void;
  readonly compressedfheuint6_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint6_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint6_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint6_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint6_serialize: (a: number, b: number) => void;
  readonly compressedfheuint8_decompress: (a: number, b: number) => void;
  readonly compressedfheuint8_deserialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint8_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly compressedfheuint8_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly compressedfheuint8_safe_serialize: (a: number, b: number, c: number) => void;
  readonly compressedfheuint8_serialize: (a: number, b: number) => void;
  readonly fhebool_decrypt: (a: number, b: number, c: number) => void;
  readonly fhebool_deserialize: (a: number, b: number, c: number) => void;
  readonly fhebool_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fhebool_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fhebool_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fhebool_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fhebool_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fhebool_serialize: (a: number, b: number) => void;
  readonly fheint10_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint10_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint10_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint10_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint10_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint10_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint10_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint10_serialize: (a: number, b: number) => void;
  readonly fheint128_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint128_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint128_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint128_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint128_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint128_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint128_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint128_serialize: (a: number, b: number) => void;
  readonly fheint12_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint12_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint12_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint12_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint12_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint12_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint12_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint12_serialize: (a: number, b: number) => void;
  readonly fheint14_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint14_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint14_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint14_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint14_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint14_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint14_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint14_serialize: (a: number, b: number) => void;
  readonly fheint160_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint160_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint160_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint160_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint160_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint160_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint160_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint160_serialize: (a: number, b: number) => void;
  readonly fheint16_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint16_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint16_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint16_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint16_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint16_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint16_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint16_serialize: (a: number, b: number) => void;
  readonly fheint256_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint256_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint256_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint256_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint256_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint256_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint256_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint256_serialize: (a: number, b: number) => void;
  readonly fheint2_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint2_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint2_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint2_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint2_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint2_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint2_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint2_serialize: (a: number, b: number) => void;
  readonly fheint32_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint32_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint32_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint32_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint32_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint32_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint32_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint32_serialize: (a: number, b: number) => void;
  readonly fheint4_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint4_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint4_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint4_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint4_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint4_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint4_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint4_serialize: (a: number, b: number) => void;
  readonly fheint64_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint64_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint64_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint64_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint64_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint64_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint64_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint64_serialize: (a: number, b: number) => void;
  readonly fheint6_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint6_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint6_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint6_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint6_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint6_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint6_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint6_serialize: (a: number, b: number) => void;
  readonly fheint8_decrypt: (a: number, b: number, c: number) => void;
  readonly fheint8_deserialize: (a: number, b: number, c: number) => void;
  readonly fheint8_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheint8_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheint8_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheint8_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheint8_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheint8_serialize: (a: number, b: number) => void;
  readonly fheuint1024_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint1024_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint1024_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint1024_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint1024_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint1024_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint1024_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint1024_serialize: (a: number, b: number) => void;
  readonly fheuint10_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint10_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint10_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint10_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint10_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint10_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint10_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint10_serialize: (a: number, b: number) => void;
  readonly fheuint128_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint128_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint128_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint128_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint128_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint128_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint128_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint128_serialize: (a: number, b: number) => void;
  readonly fheuint12_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint12_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint12_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint12_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint12_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint12_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint12_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint12_serialize: (a: number, b: number) => void;
  readonly fheuint14_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint14_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint14_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint14_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint14_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint14_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint14_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint14_serialize: (a: number, b: number) => void;
  readonly fheuint160_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint160_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint160_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint160_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint160_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint160_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint160_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint160_serialize: (a: number, b: number) => void;
  readonly fheuint16_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint16_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint16_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint16_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint16_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint16_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint16_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint16_serialize: (a: number, b: number) => void;
  readonly fheuint2048_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint2048_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint2048_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint2048_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint2048_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint2048_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint2048_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint2048_serialize: (a: number, b: number) => void;
  readonly fheuint256_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint256_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint256_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint256_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint256_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint256_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint256_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint256_serialize: (a: number, b: number) => void;
  readonly fheuint2_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint2_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint2_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint2_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint2_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint2_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint2_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint2_serialize: (a: number, b: number) => void;
  readonly fheuint32_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint32_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint32_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint32_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint32_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint32_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint32_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint32_serialize: (a: number, b: number) => void;
  readonly fheuint4_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint4_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint4_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint4_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint4_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint4_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint4_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint4_serialize: (a: number, b: number) => void;
  readonly fheuint512_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint512_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint512_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint512_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint512_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint512_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint512_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint512_serialize: (a: number, b: number) => void;
  readonly fheuint64_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint64_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint64_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint64_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint64_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint64_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint64_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint64_serialize: (a: number, b: number) => void;
  readonly fheuint6_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint6_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint6_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint6_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint6_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint6_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint6_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint6_serialize: (a: number, b: number) => void;
  readonly fheuint8_decrypt: (a: number, b: number, c: number) => void;
  readonly fheuint8_deserialize: (a: number, b: number, c: number) => void;
  readonly fheuint8_encrypt_with_client_key: (a: number, b: number, c: number) => void;
  readonly fheuint8_encrypt_with_compressed_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint8_encrypt_with_public_key: (a: number, b: number, c: number) => void;
  readonly fheuint8_safe_deserialize: (a: number, b: number, c: number, d: number) => void;
  readonly fheuint8_safe_serialize: (a: number, b: number, c: number) => void;
  readonly fheuint8_serialize: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint2048_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint512_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint256_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint160_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint128_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint64_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint32_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint16_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint14_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint12_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint10_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint8_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint6_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint4_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint2_free: (a: number, b: number) => void;
  readonly __wbg_fheint6_free: (a: number, b: number) => void;
  readonly __wbg_fheint8_free: (a: number, b: number) => void;
  readonly __wbg_fheint4_free: (a: number, b: number) => void;
  readonly __wbg_fheint2_free: (a: number, b: number) => void;
  readonly __wbg_fheint14_free: (a: number, b: number) => void;
  readonly __wbg_fheint16_free: (a: number, b: number) => void;
  readonly __wbg_fheint32_free: (a: number, b: number) => void;
  readonly __wbg_fheint12_free: (a: number, b: number) => void;
  readonly __wbg_fheint128_free: (a: number, b: number) => void;
  readonly __wbg_fheuint2_free: (a: number, b: number) => void;
  readonly __wbg_fheuint4_free: (a: number, b: number) => void;
  readonly __wbg_fheint64_free: (a: number, b: number) => void;
  readonly __wbg_fheuint8_free: (a: number, b: number) => void;
  readonly __wbg_fheuint10_free: (a: number, b: number) => void;
  readonly __wbg_fheuint12_free: (a: number, b: number) => void;
  readonly __wbg_fheuint14_free: (a: number, b: number) => void;
  readonly __wbg_fheuint16_free: (a: number, b: number) => void;
  readonly __wbg_fheuint32_free: (a: number, b: number) => void;
  readonly __wbg_fheuint6_free: (a: number, b: number) => void;
  readonly __wbg_fheuint128_free: (a: number, b: number) => void;
  readonly __wbg_fheuint512_free: (a: number, b: number) => void;
  readonly __wbg_fheuint256_free: (a: number, b: number) => void;
  readonly __wbg_fheuint160_free: (a: number, b: number) => void;
  readonly __wbg_fheuint1024_free: (a: number, b: number) => void;
  readonly __wbg_fheuint2048_free: (a: number, b: number) => void;
  readonly __wbg_fheint256_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint2_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint64_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint14_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint160_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint12_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint128_free: (a: number, b: number) => void;
  readonly __wbg_fheuint64_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint256_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint16_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint32_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint8_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint6_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheint4_free: (a: number, b: number) => void;
  readonly __wbg_compressedfheuint1024_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
