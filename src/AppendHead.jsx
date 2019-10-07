import React from 'react';

/**
 * Component used to load ressources into the `<head>` tag
 */
class AppendHead extends React.Component {
  /**
   * Initialize the Component
   * @param {Object} props 
   */
  constructor(props) {
    super(props);

    /**
     * Ressource queue
     * @type {Array}
     */
    this.queue = [];
    /**
     * Ressources currently loading
     * @type {Array}
     */
    this.loadingRessources = [];
  }

  /**
   * React lifecycle
   */
  componentDidMount(){
    this.carryChildren();
  }

  /**
   * Load ressources into the `<head>` tag
   */
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
      const ressourceAlreadyInPlace = document.querySelector(`${child.type}[name='${child.attributes.name}']`);
      if(!ressourceAlreadyInPlace){
        const element = document.createElement(child.type);

        Object.entries(child.attributes).forEach(([attribute, value]) => {
          if(attribute == 'onLoad') element.addEventListener('load', value);
          else if(attribute == 'children'){
            element.innerHTML = value + ';document.currentScript.dispatchEvent(new Event("load"));';
          }
          else{
            element.setAttribute(attribute, value);
          }
        });

        element.setAttribute('loading', true);

        if(child.order >= 0){
          this.queue.push(element);
          if(this.props.debug) console.log('[react-append-head] Ressource added to queue: ', element);
        }else{
          element.addEventListener('load', () => {
            element.removeAttribute('loading');
            if(this.props.debug) console.log('[react-append-head] Ressource loaded: ', element);
          });

          document.head.insertAdjacentElement('beforeend', element);
          if(this.props.debug) console.log('[react-append-head] Ressource injected: ', element);
        }
      }else{
        if(ressourceAlreadyInPlace.hasAttribute('loading')){
          this.loadingRessources.push(ressourceAlreadyInPlace);
        }else{
          if(this.props.debug) console.log('[react-append-head] Ressource was already loaded. Skipping.');
        }
      }
    });

    this.processQueue();
  }

  /**
   * Process the ressources queue
   */
  processQueue(){
    if(this.queue.length){
      if(this.props.debug) console.log(`[react-append-head] The queue has ${this.queue.length} queued elements.`);
      
      const toProcess = this.queue.filter(a => a.getAttribute('order') == this.queue[0].getAttribute('order'));
      if(this.props.debug) console.log(`[react-append-head] Processing ${toProcess.length} elements: `, toProcess);
      const processed = [];
      toProcess.forEach(ressource => {
        const ressourceLoaded = new Promise(resolve => {
          ressource.addEventListener('load', () => {
            ressource.removeAttribute('loading');
            if(this.props.debug) console.log('[react-append-head] Ressource loaded: ', ressource);
            resolve();
          });
        });
        processed.push(ressourceLoaded);
        
        if(this.props.debug) console.log('[react-append-head] Ressource injected: ', this.queue[0]);
        document.head.insertAdjacentElement('beforeend', ressource);
      });

      Promise.all(processed).then(() => {
        this.queue.splice(0, toProcess.length);
        this.processQueue();
      });
    }else{
      this.endCheck();
    }
  }

  /**
   * Check for still loading ressources
   */
  endCheck(){
    if(this.loadingRessources.length){
      const interval = setInterval(() => {
        this.loadingRessources = this.loadingRessources.filter(element => element.hasAttribute('loading'));
        if(!this.loadingRessources.length){
          clearInterval(interval);
          if(this.props.onLoad) this.props.onLoad();
        }
      }, 100);
    }else{
      if(this.props.onLoad) this.props.onLoad();
    }
  }

  /**
   * Component rendering
   */
  render() {
    return (null);
  }
}

export default AppendHead;