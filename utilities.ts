export function cleanString(str: string): string {
    let cleanedString = str
    cleanedString = cleanedString.replace(
        /(^( +|-+|\.+|\(+|\[+|\]+|\{+|\}+|\)+|_+)|( +|-+|\.+|\(+|\[+|\]+|\{+|\}+|\)+|_+)$)/gm,
        ""
    )
    cleanedString = cleanedString.replaceAll(".", " ")
    cleanedString = cleanedString.replaceAll("_", " ")
    cleanedString = cleanedString.trim()
    // console.log(cleanedString)
    return cleanedString
}

export function pad(number: number, size?: number): string {
    let string = String(number)
    while (string.length < (size || 2)) {
        string = "0" + string
    }
    return string
}
