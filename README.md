# react-append-head

If your react components ever need to add tags to your app's `<head>` section, this is the component for you !  

## AppendHead

You can use AppendHead inside any React app:

```jsx
import React from 'react';
import AppendHead from 'react-append-head';

class Alert extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='alert alert-warning alert-dismissible' role="alert">
        <AppendHead>
          <link name="bootstrap" rel="stylesheet" href="libs/bootstrap/css/bootstrap.min.css">
          <script name='jquery' src='libs/jquery/dist/jquery.min.js' order="0"></script>
          <script name='bootstrap-alert' src='libs/bootstrap/js/dist/alert.js' order="1"></script>
        </AppendHead>
        {this.props.children}
      </div>
    );
  }
}
```

Any direct child inside the `AppendHead` component will be transferred to the app's `<head>` section.

## Script duplicates

Every script/stylesheet must have a `name` attribute.  
It is used to avoid loading the same script multiple times.  
Only the first combination of script/name or stylesheet/name will be imported.

Example: 

```html
<!-- First occurence of a stylesheet named `bootstrap` : OK -->
<link name="bootstrap" rel="stylesheet" href="style.css">
<!-- First occurence of a script named `jquery` : OK -->
<script name='jquery' src='jquery.min.js'></script>
<!-- First occurence of a script named `bootsrap` : OK -->
<script name='bootstrap' src='bootstrap.min.js'></script>
<!-- Second occurence of a script named `bootsrap` : NOT IMPORTED -->
<script name='bootstrap' src='bootstrap2.min.js'></script>
```

## Loading script dependencies

If you need to load scripts in specific order, simply add the attribute `order` to your scripts, they will be loaded from the lowest to the highest.  
If you don't specify the `order` attribute, the script will start loading asynchronously, as soon as possible.

Example: 

```html
<!-- The `order` attribute present, this script will be loaded first -->
<script name='jquery' src='jquery.min.js' order="0"></script>
<!-- The `order` attribute is not present, this script will be loaded without waiting for any other -->
<script name='whatever' src='whatever.min.js'></script>
<!-- The `order` attribute is present, this script will be loaded after every other script with an order lower than him -->
<script name='bootstrap' src='bootstrap.min.js'></script>
```