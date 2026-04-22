package com.rideshare.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rideshare.entity.ChatMessage;
import com.rideshare.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send/{bookingId}")
    public ResponseEntity<ChatMessage> sendMessage(
            @PathVariable Long bookingId,
            @RequestBody String message,
            Principal principal
    ) {
        return ResponseEntity.ok(
                chatService.sendMessage(bookingId, message, principal.getName())
        );
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<List<ChatMessage>> getChat(@PathVariable Long bookingId) {
        return ResponseEntity.ok(chatService.getChat(bookingId));
    }
}