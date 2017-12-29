import React from 'react';
import ToolBar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';


const styles = {
  margin: '5px',
  width: '100px'
}

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


class SettingBar extends React.Component {

  state = {
    lang: 'java',
    theme: 'terminal',
    fontSize: 14
  }
  
  handleChange() {

  }

  render() {

    let i = 6;
    return <ToolBar>
      <FormControl style={styles}>
        <InputLabel htmlFor="lang-helper">Language</InputLabel>
        <Select
          value={this.props.lang}
          onChange={this.props.onLangChange}
        >
          {
            glotlanguages.map((theme) => (
              <MenuItem value={theme} primaryText={theme} >
                {theme}
              </MenuItem>

            ))
          }

        </Select>
      </FormControl>


      <FormControl style={styles}>
        <InputLabel htmlFor="theme-helper">Theme</InputLabel>
        <Select
          value={this.props.theme}
          onChange={this.props.onThemeChange}
        >
          {
            themes.map((theme) => (
              <MenuItem value={theme} primaryText={theme} >
                {theme}
              </MenuItem>
            ))
          }

        </Select>
      </FormControl>


      <FormControl style={styles}>
        <InputLabel htmlFor="theme-helper">Theme</InputLabel>
        <Select
          value={this.props.fontSize}
          onChange={this.props.onFontChange}
        >
          {

            languages.map((theme) => (
              <MenuItem value={i} primaryText={i} >
                {i++}
              </MenuItem>

            ))

          };

          </Select>
      </FormControl>


    </ToolBar>;
  }

}

export default SettingBar;