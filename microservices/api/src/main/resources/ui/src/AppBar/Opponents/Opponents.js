import React from 'react';
import './Opponents.css';

import Person from 'material-ui-icons/Person';
import Apps from 'material-ui-icons/Apps';

import Badge from 'material-ui/Badge';

class Opponents extends React.Component{
render(){
    return <div className="Opponents">

<Badge badgeContent={4} color="primary"><span>  ramu <Person/> </span> 
 </Badge>

  <Apps/> 
  
  <Badge  badgeContent={3} color="accent">
  <span> <Person/> kalu  </span>
  </Badge>

    </div>;
}
}

export default Opponents;