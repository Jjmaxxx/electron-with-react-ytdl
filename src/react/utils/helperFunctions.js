const helperFunctions = {
  setOptions:function(options){
    let optionsList = [];
    for(let i=0; i<options.length;i++){
      optionsList.push(<option key ={i} value={options[i].value}>{options[i].name}</option>)
    }
    return optionsList;
  }
}
export default helperFunctions;