import React, { Component } from 'react';
import { Layout, AutocompleteItem, Autocomplete, Divider, Icon, List, ListItem } from '@ui-kitten/components';

export default class StudentsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentsList: [],
            selectedStudents: [],
            value: "",
        }
    }

    componentDidMount() {
        let studentDataArray = [
            {title: 'Student A A', description: 'Description for Student', attended: false},
            {title: 'Student B B', description: 'Description for Student', attended: false}
        ];
        this.setState({studentsList: studentDataArray, selectedStudents: studentDataArray})
    }

    setSearchBarValue(value) { this.setState({value: value}); }
    onSelect = (index) => { this.setSearchBarValue(this.state.selectedStudents[index].title)};
    filter(item, query) { return item.title.toLowerCase().includes(query.toLowerCase()) };

    setFilteredStudentsList(data) { 
        this.setState({ selectedStudents: data})
        console.log(this.state.selectedStudents);
    };
    
    onChangeText = (query) => {
        this.setSearchBarValue(query);
        this.setFilteredStudentsList(this.state.studentsList.filter(item => this.filter(item, query)))
    };

    render() {
        const {navigation} = this.props;

        const studentIcon = (props) => ( <Icon {...props} name='person'/> );
        const rightArrowIcon = (props) => ( <Icon {...props} name='arrow-ios-forward-outline'/> );
        const userItem = ({ item, index }) => (
            <ListItem
                title={`${item.title} ${index + 1}`}
                onPress={() => {}}
                accessoryLeft={studentIcon}
            //   accessoryRight={rightArrowIcon}
            />
        );

        const renderStudent = (item, index) => (
            <AutocompleteItem
                key={index}
                title={item.title}
            />
        );

        return(
            <Layout style={{ flex: 1}}>
                <Autocomplete style={{margin:"2%"}}
                    placeholder='Place your Text'
                    ItemSeparatorComponent={Divider}
                    value={this.state.value}
                    onSelect={this.onSelect}
                    onChangeText={this.onChangeText}
                >
                    {this.state.selectedStudents.map(renderStudent)}
                </Autocomplete>
                <Divider/>
            
                <Divider/>
                <List
                    style={{width: "100%"}}
                    data={this.state.selectedStudents}
                    ItemSeparatorComponent={Divider}
                    renderItem={userItem}
                    />
            </Layout>
        )
    }
}


