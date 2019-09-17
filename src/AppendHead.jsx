import React from 'react';

class AppendHead extends React.Component {
  constructor(props) {
    super(props);

    this.queue = [];
  }

  componentDidMount(){
    this.carryChildren();
  }

  carryChildren(){
    const children = this.props.children;

    const toCarry = React.Children.map(children, (child) => ({
      type: child.type,
      order: isNaN(+child.props.order) ? -1 : +child.props.order,
      attributes: {
        ...child.props
      }
    })).sort((a, b) => a.order - b.order > 0 ? 1 : a.order - b.order < 0 ? -1 : 0);

    toCarry.forEach((child) => {
      if(!document.querySelector(`${child.type}[name='${child.attributes.name}']`)){
        const element = document.createElement(child.type);

        Object.entries(child.attributes).forEach(([attribute, value]) => {
          if(attribute != 'order') element.setAttribute(attribute, value);
        });

        if(child.order >= 0){
          this.queue.push(element);
        }else{
          document.head.insertAdjacentElement('beforeend', element);
        }
      }
    });

    this.processQueue();
  }

  processQueue(){
    if(this.queue.length){
      this.queue[0].onload = () => {
        this.queue.shift();
        this.processQueue();
      }

      document.head.insertAdjacentElement('beforeend', this.queue[0]);
    }
  }

  render() {
    return (null);
  }
}

export default AppendHead;