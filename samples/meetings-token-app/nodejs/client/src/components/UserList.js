import React, { Component } from 'react';
import { List } from '@fluentui/react/lib/List';
import Constants from '../constants';

class TokenActionButtons extends Component {
    
    markIfOrganizer(item) {
        if(item.UserInfo.Role.MeetingRole === Constants.MeetingRoles.Organizer) {
            return `${item.UserInfo.Name} (${item.UserInfo.Role.MeetingRole})`
        }
        return `${item.UserInfo.Name}`
    }

    render() {
        return (
            <div className="flex-center">
                <List className="list-center" title="Get your token"
                    items={this.props.items.map(item => ({ name: `${item.TokenNumber}. ${this.markIfOrganizer(item)}`}))}
                />
            </div>
        );
    }
}

export default TokenActionButtons;