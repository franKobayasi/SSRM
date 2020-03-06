import React from 'react';

function Loading(props) {
    return (
        <div className="app-loading">
            <div className="app-loading-center">
                <div className="app-loading-hourglass"></div>
                {
                    props.text?
                    <div className="app-loading-text">{props.text}</div>:
                    null
                }
            </div>
        </div>
    )
}
function LoadingBlack(props) {
    return (
        <div className="app-loading--black">
            <div className="app-loading-center">
                <div className="app-loading-hourglass"></div>
                {
                    props.text?
                    <div className="app-loading-text">{props.text}</div>:
                    null
                }
            </div>
        </div>
    )
}

export {Loading, LoadingBlack};