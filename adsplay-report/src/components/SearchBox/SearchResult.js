import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';

/**
 * The input is used to create the `dataSource`, so the input always matches three entries.
 */
class SearchResult extends Component {

  constructor(props) {
      super(props);
      this.state = {
        value: 'tab-1', //default
      };
      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value){
    this.setState({
      value: value,
    });
  };

  render() {
    const styles = {
        tab: {
            background: '#fff',
            color: '#333',
        },
        list: {
            padding: '10px 0',
            borderBottom: '1px solid #eee',
        },
        listLink: {
            color: '#0064bb',
            fontSize: '18px',
            textDecoration: 'none'
        },
        listText: {
            margin: '0 0 5px',
            color: '#545454'
        }
    };

    return (
      <Tabs
        value={this.state.value}
        onChange={this.handleChange}
        inkBarStyle={{background: '#1e88e5'}}
        tabItemContainerStyle={{borderBottom: '1px solid #e0e0e0'}}
      >
        <Tab label="Tất cả" value="tab-1" style={styles.tab}>
          <div style={styles.list}>
            <a href="#" style={styles.listLink}>Giấc Mơ Ca Sĩ</a>
            <p style={styles.listText}>
                Phim Bộ Nổi Bật | 434,442
            </p>
          </div>
          <div style={styles.list}>
            <a href="#" style={styles.listLink}>Thử Thách Thần Tượng</a>
            <p style={styles.listText}>
                TVShow Nổi Bật | 364,712
            </p>
          </div>
        </Tab>
        <Tab label="ADS" value="tab-2" style={styles.tab}>
          <div>
            <h2>Controllable Tab B</h2>
            <p>
              This is another example of a controllable tab. Remember, if you
              use controllable Tabs, you need to give all of your tabs values or else
              you wont be able to select them.
            </p>
          </div>
        </Tab>
        <Tab label="Phim" value="tab-3" style={styles.tab}>
          <div>
            <h2>Controllable Tab C</h2>
            <p>
              You need to give all of your tabs values or else
              you wont be able to select them.
            </p>
          </div>
        </Tab>
      </Tabs>
    );
  }
}

export default SearchResult;