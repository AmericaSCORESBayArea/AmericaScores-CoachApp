import React, {Component} from "react";
import { Layout, Divider, List, ListItem, Icon, AutocompleteItem, Autocomplete } from '@ui-kitten/components';
import Axios from "axios";

export default class TeamsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedData: [],
            value: "",
        }
    }

    componentDidMount() {
        Axios.get("http://salesforce-data-api.us-e2.cloudhub.io/api/coach/0031T00003OcljGQAR/teamseasons", {
            params: {
                date: `2020-07-15`
            }
        })
        .then(response => this.setState({data: response.data, selectedData: response.data}))
        .catch(e => console.log(e));
    }

    setSearchBarValue(value) { this.setState({value: value}); }
    onSelect = (index) => { this.setSearchBarValue(this.state.selectedData[index].TeamSeasonName)};
    filter(item, query) { return item.TeamSeasonName.toLowerCase().includes(query.toLowerCase()) };

    setData(data) { this.setState({selectedData: data}) };
    
    onChangeText = (query) => {
        this.setSearchBarValue(query);
        this.setData(this.state.data.filter(item => this.filter(item, query)))
    };

    render() {
        const {navigation} = this.props;

        const renderItemIcon = (props) => ( <Icon {...props} name='arrow-ios-forward-outline'/>);
        let renderItem = ({ item, index }) => (
            <ListItem 
                title={`${item.TeamSeasonName}`}
                description={`${item.description} ${index + 1}`}
                accessoryRight={renderItemIcon}
                onPress={() => navigation.navigate("Activities")}
            />
        );

        const renderOption = (item, index) => (
            <AutocompleteItem
                key={index}
                title={item.title}
            />
        );
  
        return(
            <Layout style={{ flex: 1, justifyContent: 'center'}}>
                <Autocomplete style={{margin:"2%"}}
                    placeholder='Place your Text'
                    ItemSeparatorComponent={Divider}
                    value={this.state.value}
                    onSelect={this.onSelect}
                    onChangeText={this.onChangeText}
                >
                    {this.state.selectedData.map(renderOption)}
                </Autocomplete>
                <Divider/>

                <List
                    style={{width:"100%"}}
                    data={this.state.selectedData}
                    ItemSeparatorComponent={Divider}
                    renderItem={renderItem}
                    />
            </Layout>
        );
    };
}