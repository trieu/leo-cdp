import React from 'react';
import ReactDOM from 'react-dom';
import mixitup from 'mixitup';
import List from './Card';

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

    renderItem(data){
        if (data.length <= 0) {
            return (
                <Card 
                    label="Không có dữ liệu"
                />
            )
        }

        var grids = ['col-xs'+ this.props.grids[0] || 12, 'col-sm'+ this.props.grids[1] || 12, 'col-md'+ this.props.grids[2] || 12].join(' ');
        var tags = "";
        if(this.props.tags){
            tags = this.props.tags.join(' ');
        }
        var styles = [grids, 'padding-bottom-1rem', tags].join(' ')
        return (
                <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem mix green">
                    <Card 
                        label="Thể loại phim"
                        body={"dddd"}
                    />
                </div>
            );

    }

    render() {
        return (
            <div>
                <div className="row" data-ref="container">
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem mix green">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem mix blue">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem mix pink">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem mix green">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem mix blue">
                        <Card 
                            label="Thể loại phim"
                            body={"dddd"}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem mix green">
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