export enum CommonErrorCodes {
    NOT_INSTANTIABLE_CLASS = 'NOT_INSTANTIABLE_CLASS',
    NOT_CALLABLE_METHOD = 'NOT_CALLABLE_METHOD',
    UNIMPLEMENTED_METHOD = 'UNIMPLEMENTED_METHOD',
    UNIMPLEMENTED_GET = 'UNIMPLEMENTED_GET'
}

export enum CommonErrorNoCodes {
    NOT_INSTANTIABLE_CLASS = 1001,
    NOT_CALLABLE_METHOD = 1002,
    UNIMPLEMENTED_METHOD = 1003,
    UNIMPLEMENTED_GET = 1004
}

export enum CommonErrorStates {
    NOT_INSTANTIABLE_CLASS = 'ERR01',
    NOT_CALLABLE_METHOD = 'ERR02',
    UNIMPLEMENTED_METHOD = 'ERR03',
    UNIMPLEMENTED_GET = 'ERR04'
}

export enum CommonErrorMessages {
    NOT_INSTANTIABLE_CLASS = 'Class %s is not instantiable',
    NOT_CALLABLE_METHOD = 'Method "%s" is not calable in class %s',
    UNIMPLEMENTED_METHOD = 'Unimplemented class %s method "%s" in subclass %s',
    UNIMPLEMENTED_GET = 'Unimplemented class getter "%s" in subclass %s'
}

export type CommonErrorCode = keyof typeof CommonErrorCodes