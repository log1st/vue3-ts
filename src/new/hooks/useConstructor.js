import {computed} from "@vue/composition-api";
import {useStore} from "@/new/hooks/useStore";

export const useConstructor = () => {
  const store = useStore();


  const setEncoding = ({ template }) => {
    return new Promise ((resolve, reject) => {
        String.prototype.insert = function(index, string) {
            if (index > 0) {
              return this.substring(0, index) + string + this.substr(index);
            }
            return string + this;
          };
        const utf8 = `<meta charset="UTF-8"><meta content="text/html; charset=utf-8" http-equiv="Content-Type">`;
        let resultTemplate = template.insert(30, utf8);
        resolve(resultTemplate);
    })
  }

  return {
    setEncoding
  }
}
