export const createRegex = (regexString: string): [boolean, RegExp | undefined] => {
    if (!regexString) return [true, undefined];

    try {
      let regex: RegExp;
      const regexMatch = regexString.match(/^\s*\/(.*)\/([gmiyus]*)\s*$/);
      if (regexMatch) {
        regexString = regexMatch[1];
        var flags = regexMatch[2];
        regex = new RegExp(regexString, flags);
      } else {
        regex = new RegExp(regexString, 'g');
      }
      return [true, regex];
    } catch (error) {
      console.log('Regex invalid')
      return [false, undefined];
    }
}