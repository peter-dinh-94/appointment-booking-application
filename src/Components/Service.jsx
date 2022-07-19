import React, { useContext } from 'react';

import ApmtSteps from './ApmtSteps';
import ServiceCard from './ServiceCard';
import { services } from './TestData';
import AppContext from '../Contexts/app-context';

function Section() {
  const ctx = useContext(AppContext);

  const handleSelected = (index) => {
    if (!services[index].selected) {
      ctx.setSelectedServices('add', services[index]);
      services[index].selected = true;
    } else {
      ctx.setSelectedServices('remove', services[index]);
      services[index].selected = false;
    }
  };

  return (
    <section className="container landing">
      <section className="row">
        <aside className="col col-md-3 m-bottom--32 w-background-light display-desktop appointment-info font--small">
          <ApmtSteps step="service" />
        </aside>
        <div className="col col-sm-10 offset-sm-1 col-md-8 appointment-content w-background-light widget-reservation-services">
          <h3 className="font--bold m-bottom--24">
            Select one or more services
          </h3>
          {services.map((data, index) => {
            return (
              <ServiceCard
                index={index}
                id={data.id}
                name={data.name}
                price={data.price}
                time={data.time}
                description={data.description}
                onSelected={handleSelected}
                selected={data.selected}
              />
            );
          })}
        </div>
      </section>
    </section>
  );
}

export default Section;
