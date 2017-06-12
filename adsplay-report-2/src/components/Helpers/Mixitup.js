import React from 'react';
import ReactDOM from 'react-dom';
import mixitup from 'mixitup';
import Card from './Card';

export default class Mixitup extends React.Component {
    constructor(props){
        super(props);
    }
    
    componentDidMount() {
        this.renderElement(this.props);
    }

    // componentWillReceiveProps(newProps) {
    //     this.renderElement(newProps);
    // }

    renderElement(props){

        // var data = props.data || {};

        // var options = Object.create(props.options || {});

        // var opts = {
        // }
        
        // Object.assign(options, opts);

        var container = document.querySelector('[data-ref="container"]');
        console.log(container)
            var inputSearch = document.querySelector('[data-ref="input-search"]');
            var keyupTimeout;

            var mixer = mixitup(container, {
                animation: {
                    duration: 350,
                    animateResizeContainer: false // required to prevent column algorithm bug
                },
                callbacks: {
                    onMixClick: function() {
                        // Reset the search if a filter is clicked

                        if (this.matches('[data-filter]')) {
                            inputSearch.value = '';
                        }
                    }
                }
            });

            // Set up a handler to listen for "keyup" events from the search input

            inputSearch.addEventListener('keyup', function() {
                var searchValue;

                if (inputSearch.value.length < 3) {
                    // If the input value is less than 3 characters, don't send

                    searchValue = '';
                } else {
                    searchValue = inputSearch.value.toLowerCase().trim();
                }

                // Very basic throttling to prevent mixer thrashing. Only search
                // once 350ms has passed since the last keyup event

                clearTimeout(keyupTimeout);

                keyupTimeout = setTimeout(function() {
                    filterByString(searchValue);
                }, 350);
            });

            /**
             * Filters the mixer using a provided search string, which is matched against
             * the contents of each target's "class" attribute. Any custom data-attribute(s)
             * could also be used.
             *
             * @param  {string} searchValue
             * @return {void}
             */

            function filterByString(searchValue) {
                if (searchValue) {
                    // Use an attribute wildcard selector to check for matches

                    mixer.filter('[class*="' + searchValue + '"]');
                } else {
                    // If no searchValue, treat as filter('all')

                    mixer.filter('all');
                }
            }

    }

    render() {
        return (
            <div>
                <div className="controls">
                    <button type="button" className="control" data-filter="all">All</button>
                    <button type="button" className="control" data-filter=".green">Green</button>
                    <button type="button" className="control" data-filter=".blue">Blue</button>
                    <button type="button" className="control" data-filter=".pink">Pink</button>
                    <button type="button" className="control" data-filter="none">None</button>

                    <button type="button" className="control" data-sort="default:asc">Asc</button>
                    <button type="button" className="control" data-sort="default:desc">Desc</button>

                    <input type="text" className="input" data-ref="input-search" placeholder="Search by color"/>
                </div>
                <div className="row" data-ref="container">
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                </div>
            </div> 
        );
    }
}