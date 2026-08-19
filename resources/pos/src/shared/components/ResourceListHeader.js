import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoxOpen,
    faCartShopping,
    faReceipt,
} from "@fortawesome/free-solid-svg-icons";

const resourceIcons = {
    products: faBoxOpen,
    purchases: faCartShopping,
    sales: faReceipt,
};

const ResourceListHeader = ({ eyebrow, title, description, type, stats }) => (
    <section className="resource-list-hero" aria-labelledby={`${type}-list-title`}>
        <div className="resource-list-hero__intro">
            <div className={`resource-list-hero__icon resource-list-hero__icon--${type}`}>
                <FontAwesomeIcon icon={resourceIcons[type]} />
            </div>
            <div>
                <span className="resource-list-hero__eyebrow">{eyebrow}</span>
                <h1 id={`${type}-list-title`}>{title}</h1>
                <p>{description}</p>
            </div>
        </div>

        <div className="resource-list-stats" aria-label="Resumen del listado">
            {stats.map((stat) => (
                <div
                    className={`resource-list-stat resource-list-stat--${stat.tone || "neutral"}`}
                    key={stat.label}
                >
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    {stat.helper ? <small>{stat.helper}</small> : null}
                </div>
            ))}
        </div>
    </section>
);

export default ResourceListHeader;
