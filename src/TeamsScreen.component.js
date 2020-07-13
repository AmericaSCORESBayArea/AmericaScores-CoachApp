import React, {Component} from "react";
import { Layout, Divider, List, ListItem, Icon, AutocompleteItem, Autocomplete } from '@ui-kitten/components';

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
        let dataArray = [
            {title: 'School A - Season 1', description: 'Description for Item'},
            {title: 'School A - Season 2', description: 'Description for Item'},
            {title: 'School B - Season 1', description: 'Description for Item'},
            {title: 'School C - Season 1', description: 'Description for Item'}
        ];
        this.setState({data: dataArray, selectedData: dataArray})
    }

    setSearchBarValue(value) { this.setState({value: value}); }
    onSelect = (index) => { this.setSearchBarValue(this.state.selectedData[index].title)};
    filter(item, query) { return item.title.toLowerCase().includes(query.toLowerCase()) };

    setData(data) { this.setState({selectedData: data}) };
    
    onChangeText = (query) => {
        this.setSearchBarValue(query);
        this.setData(this.state.data.filter(item => this.filter(item, query)))
    };

    render() {
        const {navigation} = this.props;

        const renderItemIcon = (props) => ( <Icon {...props} name='arrow-ios-forward-outline'/>);
        let renderItem = ({ item, index }) => (
            <ListItem title={`${item.title} ${index + 1}`}
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