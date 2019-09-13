enum Type {
    WEBSITE,
    WEBPAGE,
    IMAGE, // Includes GIFs and WebMs
    VIDEO
};

enum TransitionStyle {
    NONE,
    FADE,
    SLIDE,
    SHIFT
};

enum TransitionMeta {
    UP,
    DOWN,
    LEFT,
    RIGHT
};

enum TransitionTimingFunction { // Same as their CSS counterpart
    EASE,
    LINEAR,
    EASE_IN,
    EASE_OUT,
    EASE_IN_OUT
};

interface Config {
    uri: string,
    duration: number,
    wait: number,
    transitionStyle: TransitionStyle,
    transitionMeta?: TransitionMeta,
    transitionTimingFunction?: TransitionTimingFunction
};

class Presentable {
    type:   Type;
    config: Config;
    
    constructor(type: Type, config: Config) {
        this.type   = type;
        this.config = config;
    }
}

export default Presentable;
export {
    Type,
    TransitionStyle,
    TransitionMeta,
    TransitionTimingFunction,
    Config
};