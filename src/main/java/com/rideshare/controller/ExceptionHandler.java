package com.rideshare.controller;

public @interface ExceptionHandler {

    Class<Exception> value();

}
