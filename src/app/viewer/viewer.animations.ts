import {state, style, transition, animate, trigger} from "@angular/core";

export const imageTransition = trigger('imageTransition', [
    state('enterFromRight', style({
        opacity: 1,
        transform: 'translate(0px, 0px)'
    })),
    state('enterFromLeft', style({
        opacity: 1,
        transform: 'translate(0px, 0px)'
    })),
    state('leaveToLeft', style({
        opacity: 0,
        transform: 'translate(-10%, 0px)'
    })),
    state('leaveToRight', style({
        opacity: 0,
        transform: 'translate(10%, 0px)'
    })),
    transition('* => enterFromRight', [
        style({
            opacity: 0,
            transform: 'translate(3%, 0px)'
        }),
        animate('250ms 500ms ease-in')
    ]),
    transition('* => enterFromLeft', [
        style({
            opacity: 0,
            transform: 'translate(-3%, 0px)'
        }),
        animate('250ms 500ms ease-in')
    ]),
    transition('* => leaveToLeft', [
        style({
            opacity: 1,
            transform: 'translate(0px, 0px)'
        }),
        animate('250ms ease-out')]
    ),
    transition('* => leaveToRight', [
        style({
            opacity: 1,
            transform: 'translate(0px, 0px)'
        }),
        animate('250ms ease-out')]
    )
])

export const showViewerTransition = trigger('showViewerTransition', [
        state('true', style({
            opacity: 1
        })),
        state('void', style({
            opacity: 0
        })),
        transition('void => *', [
            style({
                opacity: 0
            }),
            animate('1000ms ease-in')]
        ),
        transition('* => void', [
            style({
                opacity: 1
            }),
            animate('500ms ease-out')]
        )
    ])