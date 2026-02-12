package com.rideshare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rideshare.entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {



}
