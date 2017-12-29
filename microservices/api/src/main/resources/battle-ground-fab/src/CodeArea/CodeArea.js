import React, {Component} from 'react';
import  './CodeArea.css';
import AceEditor from 'react-ace';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import SettingBar from './SettingBar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import green from 'material-ui/colors/green';
import CheckIcon from 'material-ui-icons/Check';
import ErrorIcon from 'material-ui-icons/Error';
import TextField from 'material-ui/TextField';

var glotlanguages = [
    "assembly", //
    // "ats",
    // "bash",
    "c", //
    "clojure",//
    "cobol",//
    "coffeescript",//
    "cpp", //
    "crystal",
    "csharp",//
    "d",//
    "elixir", //
    "elm",//
    "erlang",//
    "fsharp",
    "go", //
    "groovy",//
    "haskell",//
    "idris",
    "java",//
    "javascript",//
    "julia", //
    "kotlin", //
    "lua", //
    "mercury",
    "nim",
    "ocaml",//
    "perl", //
    "perl6", //
    "php",//
    "python",  //
    "ruby",//
    "rust",//
    "scala",//
    "swift",//
    "typescript" //
  ];
  
  const languages = [
    'javascript',
    'java',
    'python',
    // 'xml',
    'ruby',
    //  'sass',
    //  'markdown',
    //  'mysql',
    // 'json',
    //  'html',
    //  'handlebars',
    'golang',
    'csharp',
    'elixir',
    'typescript',
    // 'css',
    'c_cpp',
    'assembly_x86',
    'clojure',
    'cobol',
    'coffee',
    'd',
    'elm',
    'erlang',
    'groovy',
    'haskell',
    'julia',
    'kotlin',
    'lua',
    'ocaml',
    'perl',
    'php',
    'rust',
    'scala',
    'swift',
  ]
  
  const themes = [
    'monokai',
    'github',
    'tomorrow',
    'kuroir',
    'twilight',
    'xcode',
    'textmate',
    'solarized_dark',
    'solarized_light',
    'terminal',
  ]
  
  
  languages.forEach((lang) => {
    require(`brace/mode/${lang}`)
    require(`brace/snippets/${lang}`)
  })
  
  
  themes.forEach((theme) => {
    require(`brace/theme/${theme}`)
  })
class CodeArea extends Component {

  changeEditorLanguage(language) {
    
        switch (language) {
    
    
          case "assembly":
            this.setState({
              mode: "assembly_x86"
            });
    
            break; //
          // "ats": break;
          // "bash": break;
          case "c":
            this.setState({
              mode: "c_cpp"
            });
            break; //
          case "clojure":
            this.setState({
              mode: "clojure"
            });
            break;//
          case "cobol":
            this.setState({
              mode: "cobol"
            });
    
            break;//
          case "coffeescript":
            this.setState({
              mode: "coffee"
            });
            break;//
          case "cpp":
            this.setState({
              mode: "c_cpp"
            });
            break; //
          //  case "crystal": 
          //  this.setState({
          //   mode:"c_cpp"
          // });
          //  break;
          case "csharp":
            this.setState({
              mode: "csharp"
            });
            break;//
          case "d":
            this.setState({
              mode: "d"
            });
            break;//
          case "elixir":
            this.setState({
              mode: "elixir"
            });
            break; //
          case "elm":
            this.setState({
              mode: "elm"
            });
            break;//
          case "erlang":
            this.setState({
              mode: "erlang"
            });
            break;//
          //  case "fsharp":
          //  this.setState({
          //   mode:"c_cpp"
          // });
          //  break;
          case "go":
            this.setState({
              mode: "golang"
            });
            break; //
          case "groovy":
            this.setState({
              mode: "groovy"
            });
            break;//
          case "haskell":
            this.setState({
              mode: "haskell"
            });
            break;//
          // case "idris": break;
          case "java":
            this.setState({
              mode: "java"
            });
            break;//
          case "javascript":
            this.setState({
              mode: "javascript"
            });
            break;//
          case "julia":
            this.setState({
              mode: "julia"
            });
            break; //
          case "kotlin":
            this.setState({
              mode: "kotlin"
            });
            break; //
          case "lua":
            this.setState({
              mode: "lua"
            });
            break; //
          // case "mercury": break;
    
    
          // case "nim": break;
          case "ocaml":
            this.setState({
              mode: "ocaml"
            });
            break;//
          case "perl":
            this.setState({
              mode: "perl"
            });
            break; //
          case "perl6":
            this.setState({
              mode: "perl"
            });
            break; //
          case "php":
            this.setState({
              mode: "php"
            });
            break;//
          case "python":
            this.setState({
              mode: "python"
            });
            break;  //
          case "ruby":
            this.setState({
              mode: "ruby"
            });
            break;//
          case "rust":
            this.setState({
              mode: "rust"
            });
            break;//
          case "scala":
            this.setState({
              mode: "scala"
            });
            break;//
          case "swift":
            this.setState({
              mode: "swift"
            });
            break;//
          case "typescript":
            this.setState({
              mode: "typescript"
            });
            break; //    
        }
    
      }
      state = {
     
        theme: 'monokai',
        mode: 'java',
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        fontSize: 14,
        showGutter: true,
        showPrintMargin: true,
        highlightActiveLine: true,
        enableSnippets: false,
        showLineNumbers: true,
     
        dopen:false,
        loading:false,
        success:false
      };

  

        

   
    //       render(){
    //     return <section className="CodeArea">I am CodeArea"</section>;
    // }

    render(){

  
return <div>

<SettingBar
fontSize={this.state.fontSize}
lang={this.props.language}
theme={this.state.theme}
 onLangChange={(value)=>{
  this.setState({
   language:value.target.value
 })

 this.props.onLanguageChange(value.target.value);

 this.changeEditorLanguage(value.target.value)
 }} 


 onFontChange={(value)=>{
 this.setState({
   fontSize:value.target.value
 })

 }}
onThemeChange={(value)=>{
  this.setState({
   theme:value.target.value
 })
}}

/>


 <AceEditor
    style={{
        width:'95vw',
    }}
    mode={this.state.mode}
    theme={this.state.theme}
    name="UNIQUE_ID_OF_DIV"
    editorProps={{ $blockScrolling: true }}
    enableBasicAutocompletion={this.state.enableBasicAutocompletion}
    enableLiveAutocompletion={this.state.enableLiveAutocompletion}
    showSettingsMenu={true}
    mode={this.state.mode}
    theme={this.state.theme}
    name="blah2"
    onLoad={this.onLoad}
    // onChange={(value) => {
    //   this.state.code = value;

    //   console.log("value changed");

    //   //alert(this.state.body);

    // }}

    onChange={this.props.onCodeChange}

    fontSize={this.state.fontSize}
    showPrintMargin={this.state.showPrintMargin}
    showGutter={this.state.showGutter}
    highlightActiveLine={this.state.highlightActiveLine}
    value={this.props.code}
    setOptions={{
      enableBasicAutocompletion: this.state.enableBasicAutocompletion,
      enableLiveAutocompletion: this.state.enableLiveAutocompletion,
      enableSnippets: this.state.enableSnippets,
      showLineNumbers: this.state.showLineNumbers,
      tabSize: 2,
    }}
  />
  
  <Typography >
  
  <TextField
          id="name"
          label="File Name"
          value={this.props.fileName}
          // onChange={(e)=>{
          //   this.setState({
          //     filename:e.target.value
          //   });
          // }}

        onChange={this.props.onFileNameChange}

          margin="normal"
        />
         <TextField
          id="name"
          label="Input"
          value={this.props.input}
          // onChange={(e)=>{
          //   this.setState({
          //     input:e.target.value
          //   });
          // }}

          onChange={this.props.onInputChange}
          margin="normal"
        />
       
         
            </Typography>

  </div>
    }


}


export default CodeArea;