import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoxOpen,
    faCartShopping,
    faReceipt,
} from "@fortawesome/free-solid-svg-icons";

const detailIcons = {
    product: faBoxOpen,
    purchase: faCartShopping,
    sale: faReceipt,
};

const ResourceDetailHeader = ({
    type,
    eyebrow,
    title,
    description,
    status,
    statusTone = "primary",
    stats = [],
}) => (
    <section className="resource-detail-hero" aria-labelledby={`${type}-detail-title`}>
        <div className="resource-detail-hero__main">
            <div className={`resource-detail-hero__icon resource-detail-hero__icon--${type}`}>
                <FontAwesomeIcon icon={detailIcons[type]} />
            </div>
            <div className="resource-detail-hero__copy">
                <span className="resource-detail-hero__eyebrow">{eyebrow}</span>
                <h1 id={`${type}-detail-title`}>{title}</h1>
                <p>{description}</p>
            </div>
            {status ? (
                <span className={`resource-detail-status resource-detail-status--${statusTone}`}>
                    <i aria-hidden="true" />
                    {status}
                </span>
            ) : null}
        </div>

        {stats.length ? (
            <div className="resource-detail-stats" aria-label="Resumen">
                {stats.map((stat) => (
                    <div className="resource-detail-stat" key={stat.label}>
                        <span>{stat.label}</span>
                        <strong>{stat.value}</strong>
                    </div>
                ))}
            </div>
        ) : null}
    </section>
);

export default ResourceDetailHeader;
