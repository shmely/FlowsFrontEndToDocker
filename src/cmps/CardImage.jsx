import React from 'react';
import { DeleteForeverOutlined } from '@material-ui/icons';
import Loader from 'react-loader-spinner';

export const CardImage = (props) => {
    const { isImgLoading, imgUrl, title, removeImgUrl, loadingMsg } = props;
    const msg = !(loadingMsg) ? 'Loading your image..' : loadingMsg
    return (
        <React.Fragment>
            {isImgLoading && <div className="loading-field flex column align-center">
                <Loader secondaryColor="#2196f3d9" type="Circles" color="#2196F3"
                    className="loader" height={60} width={60} />
                <p>{msg}</p>
            </div>}
            {
                imgUrl && <React.Fragment>
                    <img className="card-img" src={imgUrl} alt={title} />
                    <button className="remove-btn flex align-center"
                        title="Remove cover image" onClick={removeImgUrl}>
                        <DeleteForeverOutlined className="icon" /></button>
                </React.Fragment>
            }
        </React.Fragment>
    );
}

