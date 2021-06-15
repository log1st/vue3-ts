const dayMask = (value) => {
    return [
        /[0-3]/,
        (value.charAt(0) === '0' && /[1-9]/) || (value.charAt(0) === '3' && /[0-1]/) || /[0-9]/
    ]
}

const dateMask = (value) => {
    return [
        /[0-1]/, 
        value.charAt(3) === '1' ? /[0-2]/ : /[1-9]/
    ]
}

const yearMask = (value) => {
    return [
        /[1-2]/,
        value.charAt(6) === '1' ? /[9]/ : /[0-9]/, 
        /\d/,
        /\d/
    ]
}

export const masks = {
    methods: {
        _dateMask (value){
            return [
                ...dayMask(value),
                '.',
                ...dateMask(value),
                '.',
                ...yearMask(value)
            ] 
        }
    }
}
  