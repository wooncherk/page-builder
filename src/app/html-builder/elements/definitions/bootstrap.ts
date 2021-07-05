import {LivePreview} from "../../live-preview.service";
import {selectNode} from '../../../../common/shared/appearance/utils/select-node';

export const bootstrapElements = [];

bootstrapElements.push({
    name: 'page header',
    nodes: '*',
    'class': 'page-header',
    html: '<div class="page-header">' +
    '<h1>Example page header <small>Header subtext</small></h1>' +
    '</div>',
    types: ['flow'],
    validChildren: ['flow'],
    category: 'typography',
    previewScale: '0.4',
    icon: 'header-custom'
});

bootstrapElements.push({
    name: 'progress bar',
    nodes: '*',
    'class': 'progress',
    html: `<div class="progress">
  <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
</div>`,
    types: ['flow'],
    validChildren: ['flow'],
    category: 'components',
    icon: 'show-chart'
});

bootstrapElements.push({
    name: 'list group',
    nodes: '*',
    'class': 'list-group',
    html: `<ul class="list-group">
  <li class="list-group-item">Cras justo odio</li>
  <li class="list-group-item">Dapibus ac facilisis in</li>
  <li class="list-group-item">Morbi leo risus</li>
  <li class="list-group-item">Porta ac consectetur ac</li>
  <li class="list-group-item">Vestibulum at eros</li>
</ul>`,
    types: ['flow'],
    validChildren: ['flow'],
    category: 'components',
    icon: 'view-list',
});

bootstrapElements.push({
    name: 'card',
    nodes: '*',
    'class': 'card',
    html: `<div class="card" style="width: 18rem;">
  <img src="https://via.placeholder.com/286x160?text=Placeholder%20Image" class="card-img-top" alt="">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>`,
    types: ['flow'],
    validChildren: ['flow'],
    category: 'components',
    icon: 'crop-portrait'
});

bootstrapElements.push({
    name: 'container',
    nodes: '*',
    'class': 'container',
    html: '<div class="container"></div>',
    types: ['flow'],
    validChildren: ['flow'],
    category: 'layout',
    dragHelper: true,
    icon: 'crop-square',
    attributes: {
        type: {
            list: [
                {name: 'Default', value: 'container'},
                {name: 'Wide', value: 'container-fluid'},
            ],
            value: 'container',
            onAssign: function (livePreview: LivePreview) {
                for (let i = this.list.length - 1; i >= 0; i--) {
                    if (livePreview.selected.node.className.indexOf(this.list[i].value) > -1) {
                        return this.value = this.list[i].value;
                    }
                }
            },
            onChange: function (livePreview: LivePreview, size: string) {
                //strip any previously assigned size classes from the node
                for (let i = this.list.length - 1; i >= 0; i--) {
                    if ( ! this.list[i].value) continue;
                    livePreview.selected.node.classList.remove(this.list[i].value);
                }

                livePreview.selected.node.classList.add(size);
            }
        }
    },
});

bootstrapElements.push({
    name: 'row',
    nodes: '*',
    frameworks: ['bootstrap'],
    'class': 'row',
    html: '<section class="row"><div class="col-md-4"></div><div class="col-md-3"></div><div class="col-md-5"></div></section>',
    types: ['flow'],
    validChildren: ['flow'],
    category: 'layout',
    dragHelper: true,
    icon: 'view-stream'
});


bootstrapElements.push({
    name: 'alert',
    nodes: '*',
    'class': 'well',
    html: `<div class="alert alert-primary" role="alert">
  A simple primary alert—check it out!
</div>`,
    types: ['flow'],
    validChildren: ['flow'],
    category: 'layout',
    icon: 'label'
});

bootstrapElements.push({
    name: 'label',
    nodes: '*',
    'class': 'label',
    html: '<span class="label label-success">Label</span>',
    types: ['flow', 'phrasing'],
    validChildren: ['phrasing'],
    category: 'typography',
    hiddenClasses: ['label'],
    icon: 'label'
});

bootstrapElements.push({
    name: 'column',
    nodes: '*',
    'class': 'col-*',
    html: '<div class="col-sm-6"></div>',
    types: ['flow'],
    validChildren: ['flow'],
    canModify: ['text', 'box', 'margin', 'padding', 'attributes']
});

bootstrapElements.push({
    name: 'button group',
    nodes: '*',
    'class': 'btn-group',
    html: `<div class="btn-group" role="group" aria-label="Basic example">
  <button type="button" class="btn btn-secondary">Left</button>
  <button type="button" class="btn btn-secondary">Middle</button>
  <button type="button" class="btn btn-secondary">Right</button>
</div>`,
    types: ['flow'],
    validChildren: ['button'],
    category: 'buttons',
    icon: 'view-column'
});

bootstrapElements.push({
    name: 'button toolbar',
    nodes: '*',
    'class': 'btn-toolbar',
    html: `<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
  <div class="btn-group mr-2" role="group" aria-label="First group">
    <button type="button" class="btn btn-secondary">1</button>
    <button type="button" class="btn btn-secondary">2</button>
    <button type="button" class="btn btn-secondary">3</button>
    <button type="button" class="btn btn-secondary">4</button>
  </div>
  <div class="btn-group mr-2" role="group" aria-label="Second group">
    <button type="button" class="btn btn-secondary">5</button>
    <button type="button" class="btn btn-secondary">6</button>
    <button type="button" class="btn btn-secondary">7</button>
  </div>
  <div class="btn-group" role="group" aria-label="Third group">
    <button type="button" class="btn btn-secondary">8</button>
  </div>
</div>`,
    types: ['flow'],
    validChildren: ['.btn-group'],
    category: 'buttons',
    icon: 'view-module'
});


// forms

bootstrapElements.push({
    name: 'input field',
    nodes: ['input=text', 'input=email', 'input=password'],
    frameworks: ['bootstrap'],
    html: '<input type="text" class="form-control" placeholder="Text input">',
    types: ['flow', 'phrasing', 'interactive', 'listed', 'labelable', 'submittable', 'resettable', 'reassociateable', 'form-associated'],
    validChildren: false,
    previewScale: '0.5',
    showWysiwyg: false,
    hiddenClasses: ['form-control'],
    category: 'forms',
    icon: 'power-input',
    attributes: {
        placeholder: {
            text: true,
            value: 'Text input',
            onAssign: function (livePreview: LivePreview) {
                this.value = livePreview.selected.node.getAttribute('placeholder');
            },
            onChange: function (livePreview: LivePreview, text: string) {
                livePreview.selected.node.setAttribute('placeholder', text);
                livePreview.repositionBox('selected');
            }
        },
        type: {
            list: [
                {name: 'Text', value: 'text'},
                {name: 'Password', value: 'password'},
                {name: 'Date', value: 'date'},
                {name: 'Email', value: 'email'},
                {name: 'Datetime', value: 'datetime'},
                {name: 'Datetime Local', value: 'datetime-local'},
                {name: 'Month', value: 'month'},
                {name: 'Time', value: 'time'},
                {name: 'Week', value: 'week'},
                {name: 'Number', value: 'number'},
                {name: 'Url', value: 'url'},
                {name: 'Search', value: 'search'},
                {name: 'Tel', value: 'tel'},
                {name: 'Color', value: 'color'},
            ],
            value: '',
            onAssign: function (livePreview: LivePreview) {
                for (let i = this.list.length - 1; i >= 0; i--) {
                    if (livePreview.selected.node.getAttribute('type') == this.list[i].value) {
                        return this.value = this.list[i].value;
                    }
                }

                return this.value = this.list[0].value;
            },
            onChange: function (livePreview: LivePreview, type: string) {
                livePreview.selected.node.setAttribute('type', type);
            }
        }
    },
});

bootstrapElements.push({
    name: 'text area',
    nodes: ['textarea'],
    frameworks: ['bootstrap'],
    html: '<textarea class="form-control" rows="3"></textarea>',
    types: ['flow', 'phrasing', 'interactive', 'listed', 'labelable', 'submittable', 'resettable', 'reassociateable', 'form-associated'],
    validChildren: false,
    previewScale: '0.5',
    showWysiwyg: false,
    hiddenClasses: ['form-control'],
    category: 'forms',
    icon: 'short-text',
    attributes: {
        rows: {
            text: true,
            value: 1,
            onAssign: function (livePreview: LivePreview) {
                this.value = livePreview.selected.node.getAttribute('rows');
            },
            onChange: function (livePreview: LivePreview, rows: string) {
                livePreview.selected.node.setAttribute('rows', rows);
                livePreview.repositionBox('selected');
            }
        },
        placeholder: {
            text: true,
            value: 'Placeholder...',
            onAssign: function (livePreview: LivePreview) {
                this.value = livePreview.selected.node.getAttribute('placeholder');
            },
            onChange: function (livePreview: LivePreview, text: string) {
                livePreview.selected.node.setAttribute('placeholder', text);
                livePreview.repositionBox('selected');
            }
        },
    },
});

bootstrapElements.push({
    name: 'checkbox',
    nodes: '*',
    frameworks: ['bootstrap'],
    'class': 'form-check',
    html: `<div class="form-group form-check">
    <input type="checkbox" class="form-check-input">
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>`,
    types: ['flow', 'phrasing', 'interactive', 'listed', 'labelable', 'submittable', 'resettable', 'reassociateable', 'form-associated'],
    validChildren: false,
    category: 'forms',
    showWysiwyg: false,
    icon: 'check-box'
});

bootstrapElements.push({
    name: 'input group',
    nodes: '*',
    'class': 'input-group',
    html: `<div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">@</div>
        </div>
        <input type="text" class="form-control" placeholder="Username">
      </div>`,
    types: ['flow'],
    validChildren: false,
    attributes: {
        size: {
            list: [
                {name: 'Medium', value: 'default'},
                {name: 'Large', value: 'input-group-lg'},
                {name: 'Small', value: 'input-group-sm'},
            ],
            value: 'default',
            onAssign: function (livePreview: LivePreview) {
                for (let i = this.list.length - 1; i >= 0; i--) {
                    if (livePreview.selected.node.className.indexOf(this.list[i].value) > -1) {
                        return this.value = this.list[i].value;
                    }
                }
            },
            onChange: function (livePreview: LivePreview, size: string) {
                //strip any previously assigned size classes from the node
                for (let i = this.list.length - 1; i >= 0; i--) {
                    if ( ! this.list[i].value) continue;
                    livePreview.selected.node.classList.remove(this.list[i].value);
                }

                livePreview.selected.node.classList.add(size);
            }
        }
    },
    showWysiwyg: false,
    category: 'forms',
    icon: 'view-list',
    hiddenClasses: ['input-group'],
});

bootstrapElements.push({
    name: 'form group',
    nodes: '*',
    frameworks: ['bootstrap'],
    'class': 'form-group',
    html: '<div class="form-group">' +
    '<label for="email" class="control-label">Email address</label>' +
    '<input type="email" class="form-control" id="email" placeholder="Enter email">' +
    '</div>',
    types: ['flow'],
    validChildren: false,
    attributes: {
        state: {
            list: [
                {name: 'None', value: 'default'},
                {name: 'Error', value: 'has-error'},
                {name: 'Success', value: 'has-success'},
                {name: 'Warning', value: 'has-warning'},
            ],
            value: 'default',
            onAssign: function (livePreview: LivePreview) {
                for (let i = this.list.length - 1; i >= 0; i--) {
                    if (livePreview.selected.node.className.indexOf(this.list[i].value) > -1) {
                        return this.value = this.list[i].value;
                    }
                }
            },
            onChange: function (livePreview: LivePreview, size: string) {
                //strip any previously assigned size classes from the node
                for (let i = this.list.length - 1; i >= 0; i--) {
                    if ( ! this.list[i].value) continue;
                    livePreview.selected.node.classList.remove(this.list[i].value);
                }

                livePreview.selected.node.classList.add(size);
            }
        }
    },
    showWysiwyg: false,
    category: 'forms',
    icon: 'view-headline',
    hiddenClasses: ['form-group']
});

bootstrapElements.push({
    name: 'link',
    frameworks: ['base', 'bootstrap'],
    nodes: ['a'],
    html: '<a href="#">A simple hyperlink.</a>',
    types: ['flow', 'phrasing', 'interactive'],
    validChildren: ['flow'],
    category: 'typography',
    icon: 'link'
});


bootstrapElements.push({
    name: 'addon',
    nodes: '*',
    frameworks: ['bootstrap'],
    'class': 'input-group-addon',
    html: false,
    canDrag: false,
    types: ['flow'],
    validChildren: false,
    canModify: ['text', 'attributes'],
    attributes: {
        side: {
            list: [
                {name: 'Left', value: 'left'},
                {name: 'Right', value: 'right'},
            ],
            value: false,
            onAssign: function (livePreview: LivePreview) {
                let i = 0, child;
                while((child = livePreview.selected.node.previousSibling as any) != null) i++;

                if ( ! i) {
                    this.value = this.list[0].value;
                } else {
                    this.value = this.list[1].value;
                }
            },
            onChange: function (livePreview: LivePreview, position: string) {
                const children = livePreview.selected.node.parentElement.childNodes;

                // insert input group addon either before first element of parent or after the last one
                if (position === 'right') {
                    children[children.length - 1]['after'](livePreview.selected.node);
                } else {
                    children[0]['before'](livePreview.selected.node);
                }
            }
        },
        contents: {
            list: [
                {name: 'Text', value: 'text'},
                {name: 'Checkbox', value: 'checkbox'},
                {name: 'Radio', value: 'radio'},
                {name: 'Button', value: 'button'},
                {name: 'Dropdown', value: 'dropdown'},
            ],
            onAssign: function (livePreview: LivePreview) {
                if ( ! livePreview.selected.node) return;
                let children = livePreview.selected.node.closest('.input-group-addon').childNodes;

                if (children[0].nodeType === Node.TEXT_NODE) {
                    this.value = this.list[0].value;
                } else if (children[0]['type'] == 'checkbox') {
                    this.value = this.list[1].value;
                } else if (children[0]['type'] == 'radio') {
                    this.value = this.list[2].value;
                } else if (children[0].nodeName == 'BUTTON') {
                    this.value = this.list[3].value;
                } else if (children.length > 1) {
                    this.value = this.list[4].value;
                }
            },
            onChange: function (livePreview: LivePreview, contents: string) {

                //text
                if (contents == 'text') {
                    livePreview.selected.node.classList.remove();
                    livePreview.selected.node.classList.add('input-group-addon');
                    livePreview.selected.node.innerHTML = '';
                    livePreview.selected.node.innerText = '@';
                    //checkbox
                } else if (contents == 'checkbox') {
                    livePreview.selected.node.classList.remove();
                    livePreview.selected.node.classList.add('input-group-addon');
                    livePreview.selected.node.innerHTML = '<input type="checkbox">';
                    //radio
                } else if (contents == 'radio') {
                    livePreview.selected.node.classList.remove();
                    livePreview.selected.node.classList.add('input-group-addon');
                    livePreview.selected.node.innerHTML = '<input type="radio">';
                    //button
                } else if (contents == 'button') {
                    livePreview.selected.node.classList.remove();
                    livePreview.selected.node.classList.add('input-group-btn');
                    livePreview.selected.node.innerHTML = '<button class="btn btn-default" type="button">Go!</button>';
                    //dropdown
                } else if (contents == 'dropdown') {
                    livePreview.selected.node.classList.remove();
                    livePreview.selected.node.classList.add('input-group-btn');
                    livePreview.selected.node.innerHTML =
                        '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">Action <span class="caret"></span></button>' +
                        '<ul class="dropdown-menu" role="menu">' +
                        '<li><a href="#">Action</a></li>' +
                        '<li><a href="#">Another action</a></li>' +
                        '<li><a href="#">Something else here</a></li>' +
                        '<li class="divider"></li>' +
                        '<li><a href="#">Separated link</a></li>' +
                        '</ul>';
                }
            }
        }
    },
    showWysiwyg: false,
    hiddenClasses: ['input-group-addon'],
});

bootstrapElements.push({
    name: 'select',
    nodes: ['select'],
    frameworks: ['bootstrap'],
    html: '<select class="form-control">' +
    '<option>1</option>' +
    '<option>2</option>' +
    '<option>3</option>' +
    '<option>4</option>' +
    '<option>5</option>' +
    '</select>',
    types: ['flow', 'phrasing', 'interactive', 'listed', 'labelable', 'submittable', 'resettable', 'reassociateable', 'form-associated'],
    validChildren: false,
    attributes: {
        state: {
            value: 'none',
            list: [
                {name: 'None', value: 'none'},
                {name: 'Error', value: 'has-error'},
                {name: 'Success', value: 'has-success'},
                {name: 'Warning', value: 'has-warning'},
            ],
            onAssign: function (livePreview: LivePreview) {
                for (let i = this.list.length - 1; i >= 0; i--) {
                    if (livePreview.selected.node.className.indexOf(this.list[i].value) > -1) {
                        return this.value = this.list[i].value;
                    }
                }
            },
            onChange: function (livePreview: LivePreview, state: string) {
                //strip any previously assigned classes from the node
                for (let i = this.list.length - 1; i >= 0; i--) {
                    if ( ! this.list[i].value) continue;
                    livePreview.selected.node.classList.remove(this.list[i].value);
                }

                livePreview.selected.node.classList.add(state);
            }
        }
    },
    previewScale: '0.5',
    showWysiwyg: false,
    category: 'forms',
    icon: 'arrow-drop-down'
});

bootstrapElements.push({
    name: 'image',
    nodes: ['img'],
    frameworks: ['bootstrap'],
    html: '<img src="/builder/images/default.jpg" class="img-responsive">',
    types: ['flow', 'phrasing', 'embedded', 'interactive', 'form-associated'],
    validChildren: false,
    category: 'media',
    icon: 'image',
    canModify: ['padding', 'margin', 'attributes', 'shadows', 'borders'],
    previewScale: '0.3',
    attributes: {
        shape: {
            list: [
                {name: 'Default', value: 'none'},
                {name: 'Rounded', value: 'img-rounded'},
                {name: 'Thumbnail', value: 'img-thumbnail'},
                {name: 'Circle', value: 'img-circle'},
            ],
            value: 'none',
            onAssign: function (livePreview: LivePreview) {
                for (let i = this.list.length - 1; i >= 0; i--) {
                    if (livePreview.selected.node.className.indexOf(this.list[i].value) > -1) {
                        return this.value = this.list[i].value;
                    }
                }
            },
            onChange: function (livePreview: LivePreview, type: string) {
                //strip any previously assigned type classes from the icon
                for (let i = this.list.length - 1; i >= 0; i--) {
                    if ( ! this.list[i].value) continue;
                    livePreview.selected.node.classList.remove(this.list[i].value);
                }

                livePreview.selected.node.classList.add(type);
            }
        }
    },
});

bootstrapElements.push({
    name: 'responsive video',
    nodes: '*',
    'class': 'embed-responsive',
    frameworks: ['bootstrap'],
    html: '<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="//www.youtube.com/embed/sENM2wA_FTg"></iframe></div>',
    types: ['flow'],
    validChildren: false,
    category: 'media',
    icon: 'video-library',
    canModify: ['padding', 'margin', 'shadows', 'attributes'],
    attributes: {
        url: {
            text: true,
            value: '//www.youtube.com/embed/wGp0GAd1d1s',
            onAssign(livePreview: LivePreview) {
                let selectedNode = livePreview.selected.node as HTMLIFrameElement;
                if (selectedNode.nodeName.toLowerCase() !== 'iframe') {
                    selectedNode = selectedNode.querySelector('iframe');
                }
                this.value = selectedNode.src;
            },
            onChange(livePreview: LivePreview, url: string) {
                let selectedNode = livePreview.selected.node as HTMLIFrameElement;
                if (selectedNode.nodeName.toLowerCase() !== 'iframe') {
                    selectedNode = selectedNode.querySelector('iframe');
                }
                selectedNode.src = url;
            }
        }
    },
    hiddenClasses: ['embed-responsive', 'embed-responsive-16by9', 'preview-node', 'img-responsive'],
});

bootstrapElements.push({
    name: 'image grid',
    nodes: '*',
    'class': 'image-grid',
    frameworks: ['bootstrap'],
    html: '<div class="row image-grid">' +
    '<div class="col-xs-3">' +
    '<a href="#" class="thumbnail">' +
    '<img src="/builder/images/default.jpg">' +
    '</a>' +
    '</div>' +
    '<div class="col-xs-3">' +
    '<a href="#" class="thumbnail">' +
    '<img src="/builder/images/default.jpg">' +
    '</a>' +
    '</div>' +
    '<div class="col-xs-3">' +
    '<a href="#" class="thumbnail">' +
    '<img src="/builder/images/default.jpg">' +
    '</a>' +
    '</div>' +
    '<div class="col-xs-3">' +
    '<a href="#" class="thumbnail">' +
    '<img src="/builder/images/default.jpg">' +
    '</a>' +
    '</div>' +
    '</div>',
    types: ['flow'],
    validChildren: false,
    category: 'media',
    icon: 'grid-on',
    canModify: ['padding', 'margin', 'shadows', 'attributes'],
    previewScale: '0.2'
});



