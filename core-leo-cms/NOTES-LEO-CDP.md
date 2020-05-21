
# LEO CDP

## Logo 

logomakr.com/9qp3SD

## Cost & Pricing 

* One year subscription on private Google cloud: $9,999
* Monthly Product package = $999 (ArangoDB + Google Cloud)
* Total monthly infrastructure cost: (0.52 * 24 * 30) + 235.27 = $609.67
* Total monthly DevOps cost: $89.33
* Total monthly consulting and training cost: $100
* Total monthly profit: $200


ArangoDB cost: 8 GB	20 GB (or more)	$ 0.52/hr at https://cloud.arangodb.com/home

Cloud compute cost: https://cloud.google.com/products/calculator/#id=1f054b6b-d785-4f8d-b8ea-145a0127c4fb

## Slide

* [Product vision](https://docs.google.com/presentation/d/1GHUXBjdUctDxkUS_WLqls_aT79GqOlYN3MIQvXwLN5s/edit?usp=sharing)
* Flow https://github.com/USPA-Technology/leotech-final-build/blob/master/leo-cdp-event-observer-data-flow.md

## Case study 

## Smart Recommendation Engine with multiple algorithms

https://dzone.com/articles/building-sales-recommendation-engine-with-apache-s
https://download.oracle.com/otndocs/products/spatial/pdf/oow_2016/OW2016_Building_a_Java_Recommender_System_in_15_Minutes_with_Graph_Technologies.pdf

## Public API for tracking

getContextSession
http://log.xemgiday.com/css-init?observer=tester&media=xemgiday.com&itouchid=homepage&visid=12234

record-view-event
http://log.xemgiday.com/etv?observer=tester&media=xemgiday.com&itouchid=homepage&visid=12234&ctxsk=1NlAlT5gPD4Oru3c8jVKZt&en=pageview&stouchid=homepage

record-action-event
http://log.xemgiday.com/eta?observer=tester&media=xemgiday.com&itouchid=homepage&visid=12234&ctxsk=1NlAlT5gPD4Oru3c8jVKZt&en=click&stouchid=homepage

record-conversion-event
http://log.xemgiday.com/eta?observer=tester&media=xemgiday.com&itouchid=homepage&visid=12234&ctxsk=1NlAlT5gPD4Oru3c8jVKZt&en=add_to_cart&stouchid=homepage

## Core data models
### Version 1.0

1. Touchpoint => TouchpointDaoUtil (list, save, getById) => TestTouchpointDaoUtil
1. EventObserver => EventObserverDaoUtil (list, save, getById) => TestEventObserverDaoUtil

## Security

* https://howtodoinjava.com/security/aes-256-encryption-decryption/

## Observer(Tag) Management for event tracking
* learn from https://tealium.com/assets/pdf/tag_management_comparison_matrix.pdf
* https://community.tealiumiq.com/t5/Data-Layer/Data-Layer-Definition-Publisher/ta-p/17268
* https://docs.tealium.com/platforms/javascript/universal-data-object/

## Chart & Visualization
* http://sigmajs.org
* https://www.chartjs.org
* User Journey, Gantt, Sequence https://github.com/mermaid-js/mermaid
