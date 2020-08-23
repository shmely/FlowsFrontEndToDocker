import React from 'react'
import { Check } from '@material-ui/icons';

export function MemberEdit(props) {
    const { member, toggleMemberOnCard } = props;
    const isMemberOnCard = props.card.assignedTo.some(mmbr => mmbr._id === member._id);
    const firstLastName = member.fullName.toUpperCase().split(' ');
    const initials = firstLastName.map(str => str.charAt(0)).join('').slice(0, 2);

    return (
        <div onClick={() => { toggleMemberOnCard(member) }}
            className="member-item flex align-center">
            {!member.img && <div className="initials"><span>{initials}</span></div>}
            {member.img && <span style={{ "backgroundImage": "url(" + member.img + ")" }}
                className="member-img"></span>}
            {member.fullName}{isMemberOnCard && <Check className="icon" />}
        </div>
    )
}
