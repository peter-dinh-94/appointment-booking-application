/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useReducer } from 'react';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }

  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }

  return { value: '', isValid: false };
};

const phoneReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length === 14 };
  }

  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length === 14 };
  }

  return { value: '', isValid: false };
};

function ReservationForm() {
  const Ref = useRef(null);
  const [timer, setTimer] = useState('00:00');
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null
  });

  const [phoneState, dispatchPhone] = useReducer(phoneReducer, {
    value: '',
    isValid: null
  });

  const { isValid: emailIsValid } = emailState;
  const { isValid: phoneIsValid } = phoneState;

  const startTimer = e => {
    let { total, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(minutes + ':' + (seconds > 9 ? seconds : '0' + seconds));
    }
  };

  const clearTimer = e => {
    setTimer('10:00');
    if (Ref.current) clearInterval(Ref.current);
    const timer = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = timer;

    return () => {
      clearInterval(timer);
    };
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && phoneIsValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, phoneIsValid]);

  const emailChangeHandler = event => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value });

    setFormIsValid(phoneState.isValid && event.target.value.includes('@'));
  };

  const phoneChangeHandler = event => {
    const formattedPhoneNumber = formatPhoneNumber(event.target.value);

    dispatchPhone({ type: 'USER_INPUT', val: formattedPhoneNumber });

    setFormIsValid(
      emailState.isValid && formattedPhoneNumber.trim().length === 14
    );
  };

  const validatePhoneHandler = () => {
    dispatchPhone({ type: 'INPUT_BLUR' });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  return (
    <form className="appointment-content w-background-light input-group col col-sm-10 offset-sm-1 col-md-8 widget-reservation-contact">
      <div className="widget-contact__header-section">
        <div className="widget-contact__title m-bottom--8">
          <h3 className="font--bold m-bottom--16">
            You're nearly done. Enter your information below.
          </h3>
          <p className="widget-contact__timer m-bottom--16 weight-500">
            {timer !== '0:00'
              ? `Appointment held for ${timer}`
              : 'This appointment is no longer being held'}
          </p>
        </div>
      </div>
      <div className="widget-contact__section m-bottom--48">
        <div className="row m-bottom--8">
          <div className="col col-6-sm contact-field--small-padding-right">
            <div className="ember-view client-phone">
              <input
                placeholder="Mobile phone"
                autoComplete="tel"
                type="tel"
                className="ember-view ember-text-field input-group__input input l-fill input-phone"
                autoCapitalize="off"
                value={phoneState.value}
                onChange={phoneChangeHandler}
                onBlur={validatePhoneHandler}
              ></input>
            </div>
          </div>
          <div className="col col-6-sm contact-field--small-padding-left">
            <input
              placeholder="Email"
              autoComplete="email"
              type="email"
              className="ember-view ember-text-field input-group__input input l-fill client-email"
              autoCapitalize="off"
              value={emailState.value}
              onChange={emailChangeHandler}
              onBlur={validateEmailHandler}
            ></input>
          </div>
        </div>
        <div className="row m-bottom--8">
          <div className="col col-6-sm contact-field--small-padding-right">
            <input
              placeholder="First name"
              autoComplete="given-name"
              type="text"
              className="ember-view ember-text-field input l-fill input-group__input client-first-name l-fill"
            ></input>
          </div>
          <div className="col col-6-sm contact-field--small-padding-left">
            <input
              placeholder="Last name"
              autoComplete="family-name"
              type="text"
              className="ember-view ember-text-field input l-fill input-group__input client-last-name l-fill"
            ></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <textarea
              maxLength="255"
              placeholder="Appointment notes (optional)"
              className="ember-view ember-text-area input input-textarea l-fill textarea-group__textarea buyer-note"
              spellCheck="false"
            ></textarea>
          </div>
        </div>
      </div>
      <div className="border-bottom"></div>
      <div className="m-bottom--32">
        <p className="widget-contact__new-account-explnation m-top--24">
          Upon booking, we will automatically create an account for you with
          Square Appointments. You can sign back into ... using your mobile
          number at any time.
        </p>
      </div>
      <button
        type="button"
        className="w-button w-button--primary w-button--large w-button--rounded l-fill widget-book-appointment-button ember-view button button--loading"
      >
        Book appointment
      </button>
      <p className="widget-reservation-contact__consent-message m-top--16">
        By creating this appointment, you acknowledge you will receive automated
        transactional messages from this merchant.
      </p>
    </form>
  );
}

const formatPhoneNumber = value => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
};

const getTimeRemaining = e => {
  const total = Date.parse(e) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / 1000 / 60 / 60) % 24);
  return {
    total,
    hours,
    minutes,
    seconds
  };
};

const getDeadTime = () => {
  let deadline = new Date();

  deadline.setSeconds(deadline.getSeconds() + 600);
  return deadline;
};

export default ReservationForm;
