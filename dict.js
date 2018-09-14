/**
 * 对于序列化函数的自定义的规则：
 * 1. 对于map中的key, value，序列化后的输出格式为"key"="value"
 * 2. 对于key, value中的特殊字符：\n,\b,\t,\r,\f,\",\\，序列化函数会将其转化为`\${特殊字符}`字符串,即忽略其语义
 * 3. 对于array中的最后一个map，序列化函数不会在其转换的字符串末尾添加换行符\n
 * 4. 若输入的参数并非规定的类型，则会console log该错误不会强制性转换
 */
function store(array) {
  if (!array instanceof Array) {
    console.log('please input a array');
    return;
  }
  if (!array.length) {
    return '';
  }
  let res = '';
  for (let i = 0; i < array.length; i++) {
    if (array[i] instanceof Map) {
      if (!array[i].size) {
        res += '\n';
      } else {
        let tempStr = '';
        for (let entry of array[i].entries()) {
          // check the key/value type
          if (typeof entry[0] === 'string' && typeof entry[1] === 'string') {
            let key = addBlackslash(entry[0]), value = addBlackslash(entry[1]);
            // output "key"="value"
            tempStr += `"${key}"="${value}";`;
          } else {
            console.log(`The key/value's type in ${i}th item is not string`);
            return;
          }
        }
        tempStr = tempStr.substring(0, tempStr.length - 1);
        if (i !== array.length - 1) {
          tempStr += '\n';
        }
        res +=  tempStr;
      }
    } else {
      console.log(`The ${i}th item's type in array is not map`);
      return;
    }
  }
  return res;
}

// deal with specific characters
function addBlackslash(str) {
  let res = '';
  const specificChars = {
    '\n': '\\n',
    '\b': '\\b',
    '\r': '\\r',
    '\f': '\\f',
    '\t': '\\t',
    '\\': '\\\\',
    '\"': '\\"'};
  for (let i = 0; i < str.length; i++) {
    if (specificChars[str[i]]) {
      res += specificChars[str[i]];
    } else {
      res += str[i];
    }
  }
  return res;
}

/**
 * 对于加载函数的自定义的规则：
 * 1. 输入的字符串要严格按照规定的格式，即'"key1"="value1";"key2"="value2"\nkey3"="value3"'这种格式
 * 2. 若输入的参数并非规定的类型，则会console log该错误不会强制性转换
 */
function load(text) {
  if (typeof text !== 'string') {
    console.log('please input a string');
    return;
  }
  if (text === '') {
    return [];
  }
  const maps = text.split('\n'), res = [];
  for (let i = 0; i < maps.length; i++) {
    if (!maps[i].length) {
      res.push(new Map());
    } else {
      const entities = parseStr(maps[i]), map = new Map();
      if (entities === undefined) {
        console.log(`Row(start from 0) ${i}'s format is not '"key1"="value1";"key2"="value2"\\n'`);
        return;
      }
      for (let j = 0; j < entities.length; j+= 2) {
        map.set(entities[j], entities[j+1]);
      }
      res.push(map);
    }
  }
  return res;
}
// parse string into correct format
function parseStr(str) {
  let cur = 0, count = 0, entity = '', entities = [];
  const specificChars = {
    '\\': '\\',
    '\"': '\"',
    'n': '\n',
    'b': '\b',
    'r': '\r',
    'f': '\f',
    't': '\t'
  };
  while (cur < str.length) {
    if (str[cur] === '\"') {
      count++;
      if (count % 2 === 0) {
        entities.push(entity);
        // if the character following the key is not "="
        if (entities.length % 2 === 1) {
          if (!str[cur + 1] || str[cur + 1] !== '=') {
            return;
          }
        } else  {
          // if the character following the value exists and it is not ";"
          if (str[cur + 1] && str[cur + 1] !== ';') {
            console.log(cur);
            return;
          }
        }
      }
      entity = '';
      cur++;
    } else {
      if (str[cur] === '\\') {
        if (specificChars[str[cur + 1]]) {
          entity += specificChars[str[cur + 1]];
          cur += 2;
        } else {
          entity += str[cur];
          cur++;
        }
      } else {
        entity += str[cur];
        cur++;
      }
    }
  }
  // if the str lacks a \" or it has other chars at the line end or it lacks a value
  if (entity !== '' || count % 2 === 1) {
    return;
  }
  return entities;
}


// test input
let a = [];
for (let i = 0; i < 5; i++) {
  let map = new Map();
  for (let j = 0; j < 4; j++) {
    map.set(`${i+j}`, `${i+j+1}`);
  }
  a.push(map);
}
let map = new Map();
map.set('====', ';;;;/;\n');
map.set('=;', '');
map.set('\\n\b\t\r\f\\\'\"\\m', '99=444');
a.push(map);
let m = new Map();
m.set('"==="=";;;/;\\n\\"', 'eee3q\t\\t');
a.push(m);
console.log(a);
console.log(store(a));
let t = '"0"="1";"1"="2";"2"="3";345\n' +
  '"1"="2";"2"="3";"3"="4";"4"="5"\n' +
  '"2"="3";"3"="4";"4"="5";"5"="6"\n' +
  '"3"="4";"4"="5";"5"="6";"6"="7"\n' +
  '"4"="5";"5"="6";"6"="7";"7"="8"\n' +
  '"===="=";;;;/;\\n";"=;"="";"\\\\n\\b\\t\\r\\f\\\\\'\\"\\\\m"="99=444"\n' +
  '"\\"===\\"=\\";;;/;\\\\n\\\\\\""="eee3q\\t\\\\t"';
console.log(load(t));
