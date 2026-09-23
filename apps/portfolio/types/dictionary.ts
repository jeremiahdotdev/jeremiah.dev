// Content shape authored in Sanity Site Settings. No local text defaults.
export type Dictionary = {
  theme: {
    toggle: string
    light: string
    dark: string
    system: string
    keys: {
      light: string
      dark: string
      dev: string
    }
  }
  menu: {
    toggle: string
    label: string
    navigation: string
    close: string
    heading: string
    description: string
    linkedIn: string
    resume: string
    resources: string
  }
  controls: {
    myAi: string
    askAiPrompt: string
    linkedIn: string
    resume: string
  }
  navigation: Array<{
    id: string
    heading: string
    icon?: string
  }>
  home: {
    id: string
    heading: string
    typeHeading: string[]
    typeHeadingEnd: string
  }
  timeline: {
    endDateDefault: string
  }
  carousel: {
    label: string
    item: string
    previous: string
    next: string
    previousAria: string
    nextAria: string
    showAria: string
    numberedItem: string
    position: string
  }
  career: {
    id: string
    heading: string
    intro: string
    experience: {
      one: string
      other: string
    }
    timeline: {
      label: string
      item: string
      roleAria: string
    }
    skills: {
      heading: string
      label: string
      play: string
      pause: string
      item: string
      websiteAria: string
    }
    role: {
      readMoreAria: string
      close: string
    }
  }
  academics: {
    id: string
    heading: string
    intro: string
    awardsLabel: string
    cofo: string
    focus: {
      heading: string
      gpaLabel: string
    }
    perspective: {
      label: string
      mathematics: {
        label: string
        heading: string
        description: string
      }
      faith: {
        label: string
        heading: string
        description: string
      }
      software: {
        label: string
        heading: string
        description: string
      }
    }
  }
  projects: {
    id: string
    heading: string
    description: string
    info: string
    placeholder: string
    viewDemo: string
    closeDemo: string
    repository: string
    item: string
    announcement: string
    product: string
    topics: string
    languageBreakdown: string
    languageValue: string
    preview: {
      live: string
      loading: string
      reloadAria: string
      title: string
    }
    status: {
      deprecated: string
      inProgress: string
    }
    github: {
      link: string
      public: string
      private: string
      privateTitle: string
      sourceTitle: string
      projectAria: string
      detailsAria: string
    }
    demo: {
      link: string
      aria: string
    }
  }
  blog: {
    id: string
    heading: string
    empty: string
  }
  contact: {
    id: string
    heading: string
    email: {
      name: string
      label: string
      placeholder: string
      description: string
    }
    subject: {
      name: string
      label: string
      placeholder: string
      description: string
    }
    body: {
      name: string
      label: string
      placeholder: string
      description: string
    }
    button: {
      label: string
      pastAttemptThreshold: string
    }
    successMessage: string
    failureMessage: string
    captchaFailed: string
    tooManyRequests: string
  }
  footer: {
    copyright: string
    studio: string
    captcha: {
      url: string
      label: string
      captcha: string
    }
  }
  links: {
    ai: string
    linkedIn: string
    resume: string
  }
  dev: string
}
