export const saveApp = (string) => {
  if(string){
    return string;
  }
  return 'localhost';
}

export const saveHost = (string) => {
  if(string){
    return string;
  }
  return 'localhost';
}

export const savePort = (string) => {
  const regex = /:/;
  if(regex.test(string)){
    const parts = string.split(":");
    if(parts.length == 3){
      return parts[2];
    }
    else {
      return parts[1];
    }
  }
  return string;
}
