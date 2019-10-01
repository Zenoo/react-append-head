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

    if(this.props.debug) console.log('[react-append-head] Workload: ', toCarry);

    toCarry.forEach((child) => {
      if(this.props.debug) console.log('[react-append-head] Processing: ', child);
      if(!document.querySelector(`${child.type}[name='${child.attributes.name}']`)){
        const element = document.createElement(child.type);

        Object.entries(child.attributes).forEach(([attribute, value]) => {
          if(attribute != 'order') element.setAttribute(attribute, value);
        });

        if(child.order >= 0){
          this.queue.push(element);
          if(this.props.debug) console.log('[react-append-head] Ressource added to queue.');
        }else{
          document.head.insertAdjacentElement('beforeend', element);
          if(this.props.debug) console.log('[react-append-head] Ressource injected.');
        }
      }else{
        if(this.props.debug) console.log('[react-append-head] Ressource was already loaded. Skipping.');
      }
    });

    this.processQueue();
  }

  processQueue(){
    if(this.queue.length){
      if(this.props.debug) console.log(`[react-append-head] Processing ${this.queue.length} queued elements.`);
      this.queue[0].addEventListener('load', () => {
        if(this.props.debug) console.log('[react-append-head] Ressource loaded: ', this.queue[0]);
        this.queue.shift();
        this.processQueue();
      });

      if(this.props.debug) console.log('[react-append-head] Ressource injected: ', this.queue[0]);
      document.head.insertAdjacentElement('beforeend', this.queue[0]);
    }
  }

  render() {
    return (null);
  }
}

export default AppendHead;