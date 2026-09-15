import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import TopBarProgress from "react-topbar-progress-indicator";

TopBarProgress.config({
    barColors: {
        "0": " #6571FF",
        "1.0": "#6571FF",
    },
    shadowBlur: 0,
    barThickness: 2
});

const TopProgressBar = (props) => {
    const { isLoading, global = false, force = false } = props;
    const [pendingRequests, setPendingRequests] = useState(0);

    useEffect(() => {
        if (!global) return undefined;

        const updatePendingRequests = (event) => {
            setPendingRequests((current) => Math.max(0, current + Number(event.detail || 0)));
        };
        window.addEventListener('ecuapos:request-progress', updatePendingRequests);

        return () => window.removeEventListener('ecuapos:request-progress', updatePendingRequests);
    }, [global]);

    // La barra se monta una sola vez desde AdminApp. Los usos históricos
    // dentro de cada pantalla quedan inertes para evitar barras duplicadas.
    if (!global && !force) return null;

    return force || isLoading || pendingRequests > 0 ? <TopBarProgress/> : null;
}

const mapStateToProps = (state, ownProps) => {
    return {
        isLoading: state.isLoading || ownProps.isLoading
    };
};

export default connect(mapStateToProps, null)(TopProgressBar);
