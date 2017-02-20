import React from 'react';
import {Link} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import DatePicker from 'material-ui/DatePicker';
import {grey400} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import PageBase from '../layouts/PageBase';

const FormPage = () => {

  const styles = {
    toggleDiv: {
      maxWidth: 300,
      marginTop: 40,
      marginBottom: 5
    },
    toggleLabel: {
      color: grey400,
      fontWeight: 100
    },
    buttons: {
      marginTop: 30,
      float: 'right'
    },
    saveButton: {
      marginLeft: 5
    }
  };

  return (
    <PageBase title="Form Page"
              navigation="Application / Form Page">
      <form>

        <TextField
          hintText="Name"
          floatingLabelText="Name"
          fullWidth={true}
        />

        <SelectField
          floatingLabelText="City"
          value={1}
        >
          <MenuItem value={1} primaryText="London" />
          <MenuItem value={2} primaryText="Paris" />
          <MenuItem value={3} primaryText="Rome" />
        </SelectField>

        <DatePicker
          hintText="Expiration Date"
          floatingLabelText="Expiration Date"
          fullWidth={true}/>

        <div style={styles.toggleDiv}>
          <Toggle
            label="Disabled"
            labelStyle={styles.toggleLabel}
          />
        </div>

        <Divider/>

        <div style={styles.buttons}>
          <Link to="/">
            <RaisedButton label="Cancel"/>
          </Link>

          <RaisedButton label="Save"
                        style={styles.saveButton}
                        type="submit"
                        primary={true}/>
        </div>
      </form>
    </PageBase>
  );
};

export default FormPage;
