import React from 'react';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import CheckIcon  from 'material-ui-icons/Check';
import { CircularProgress } from 'material-ui/Progress';

class RunResultArea extends React.Component{

    state={
        language: 'java',
        version: 'latest',
        filename: 'Ramu.java',
        input: 'abcd',
        loading:false,
        success:true
    }

    run(lang,input,filename,version,code) {
        var xhttp = new XMLHttpRequest();
          xhttp.onload= ()=> {
            if ( xhttp.status == 200) {
              //   document.getElementById("output").innerHTML = this.responseText;


              let obj=JSON.parse(xhttp.responseText);


              if(!obj.message){


            this.setState(()=>{return {
                output:obj.stdout,
                stderror:obj.stderr,
                error:obj.error,
                loading:false,
                success:true
              }});
            }else{
                this.setState(()=>{return {
                    error:obj.message,
                    loading:false,
                    success:true
                  }});
            }

            }
            else{
              this.setState({
                loading:false,
                success:true
              });

              alert('Network issue');

            }
          };

        

          xhttp.onprogress=()=>{

            this.setState({
              loading:true,
              success:false
            });

          }
          this.setState({
            loading:true,
            success:false,
            error:null,
            stderror:null,
            output:null
          });

          xhttp.open("POST", "https://api.circadian84.hasura-app.io/run", true);
          xhttp.setRequestHeader("input", input);
          xhttp.setRequestHeader("filename", filename);
          xhttp.setRequestHeader("version", version);
          xhttp.setRequestHeader("language", lang);
          xhttp.send(code);
        }

    render(){
        return <div>
           <Button color="primary" disabled={!this.state.success} onClick={()=>{

            //lang,input,filename,version,code
              this.run(this.props.language,this.props.input,this.props.fileName,this.props.version,this.props.code);
          }}> run
           {(this.state.error||this.state.stderror||this.state.output) &&  <CheckIcon  />  }

          {this.state.loading && <CircularProgress size={20} />}
          </Button>
          <Button color="accent" disabled={this.props.isSubmitting}> submit</Button>

          { <div>
          
          { this.state.output && (<h3> output:<pre style={{
              color:'gray'
          }}>{this.state.output}</pre> </h3>)}
          { this.state.stderror && (<h3> Runtime Exception:  <pre
          style={{
              color:'red'
          }}
          >{this.state.stderror}</pre> </h3>)}
          { this.state.error && (<h3> Error:   <pre
          style={{
              color:'red'
          }}>{this.state.error}</pre> </h3>)}

          </div>}
        
        <div>{this.props.output}</div>
        <div>{this.props.stderr}</div>
        <div>{this.props.error}</div>
        
        </div>;
    }
}

export default RunResultArea;