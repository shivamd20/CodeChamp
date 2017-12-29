import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AppBar from './AppBar/AppBar';
import CodeArea from './CodeArea/CodeArea';
import ProblemArea from './ProblemArea/ProblemArea';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import RunResultArea from './RunResultArea';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});



  


class App extends Component {

state={
  error:"",
  stderr:"",
  output:"",
  code: `
  public class Ramu{
    public static void main(String ...args)
      {
       java.util.Scanner sc=new java.util.Scanner(System.in);
       System.out.println(sc.nextInt()+sc.nextInt());
        sc.close();
            }
     }`,
     language: 'java',
     version: 'latest',
     fileName: 'Ramu.java',
     input: '1 2',

}

runResult(output,stderr,error){
  alert(output+stderr+error);
}

  
  render(props) {
    return (
      <div >
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"/>
        <AppBar/>
       
        <div style={{
          marginTop:'70px'
        }}>
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography ><h3>Problem</h3></Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
          <ProblemArea/>
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography ><h2>Coding Area</h2></Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
          <CodeArea
          code={this.state.code}
          input={this.state.input}
          language={this.state.language}
          fileName={this.state.fileName}
          isCompiling={this.state.isSubmitting}
          onRun={()=>{alert('ramesh')}}
          runResult={this.runResult}

          onLanguageChange={(value)=>{
            this.setState(
              {
                language:value
              }
            )
          }}
          onInputChange={(value)=>{
            this.setState(
              {
                input:value.target.value
              }
            )
          }}
          onFileNameChange={(value)=>{
            this.setState(
              {
                fileName:value.target.value
              }
              
            )
          }}
          onCodeChange={(value)=>{this.setState({
            code:value
          })}}

          />
          </Typography>
        </ExpansionPanelDetails>
 
      </ExpansionPanel>
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>

        <h3>Compile and Run</h3> 
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <Typography>
        <RunResultArea 
        code={this.state.code}
        input={this.state.input}
        fileName={this.state.fileName}
        language={this.state.language}
        version={"latest"}
        />
        </Typography>
      </ExpansionPanelDetails>
      </ExpansionPanel>
      
    </div>
    <footer>
     Shivam Kumar Dwivedi <a href="https://github.com/shivamd20">Fork me on github</a>
        </footer>
      </div>
    );
  }
}

export default App;
