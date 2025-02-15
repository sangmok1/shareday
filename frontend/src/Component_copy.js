import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Header from './components/Header/Header';


class MyComponent extends Component{
    render() {
        const {name,favoriteNumber,children} = this.props;
        return(
            <div>
                <Header />
            안녕하세요, 제이름은 {name} 입니다.<br />
            children 값은 {children}입니다.
            <br />
            제가 좋아하는 숫자는 {favoriteNumber} 입니다. 
            </div>            
        );
    }
}

// const MyComponent = ({ name,favoriteNumber,children }) => {
//     <div>
//         안녕하세요, 제이름은 {name} 입니다.<br />
//         children 값은 {children}입니다.
//         <br />
//         제가 좋아하는 숫자는 {favoriteNumber} 입니다. 
//     </div>
// };

MyComponent.defaultProps = {
    name: '사용자'
};

MyComponent.propTypes = {
    name: PropTypes.string,
    children : PropTypes.string,
    favoriteNumber : PropTypes.number.isRequired
};

export default MyComponent;