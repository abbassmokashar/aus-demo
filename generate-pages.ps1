$template = Get-Content -Raw -Path "C:\Users\MC\Desktop\test\aus-bachelor-accounting.html"

# Bachelor programs
$bachelorPrograms = @(
  @{
    File = "aus-bachelor-business-management.html"
    Title = "Business Management — Bachelor's Degree | AUS Business School"
    HeroName = "Business Management"
    Specialization = "Business Management"
    OverviewH2 = "Prepare for leadership roles in a fast-moving global economy."
    OverviewP1 = "The Business Management specialization equips students with the core skills needed to lead teams, manage operations, and drive organizational performance. Designed for aspiring leaders and entrepreneurs, it covers strategy, organizational behavior, marketing, finance, and innovation — giving graduates the confidence to manage complexity and deliver results across industries."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Strategic planning and execution","Organizational behavior and leadership","Marketing and brand management","Operations and supply chain management","Financial management and analysis","Human resource management fundamentals","Innovation and entrepreneurship","Business analytics and data-driven decisions")
    CareerTitle = "Your Future in Business Management"
    CareerDesc = "The Business Management specialization prepares students for careers in consulting, operations, strategy, entrepreneurship, and general management. Students develop leadership, analytical, and decision-making skills needed to manage people, projects, and organizations effectively."
    Careers = @(
      @{ Title="Management Consultant"; Desc="Advise organizations on strategy, operations, and performance improvement to achieve sustainable growth." },
      @{ Title="Operations Director"; Desc="Oversee daily business operations, streamline processes, and ensure organizational efficiency and profitability." },
      @{ Title="Business Analyst"; Desc="Analyze business processes and data to identify opportunities for improvement and support strategic decision-making." },
      @{ Title="Strategy Director"; Desc="Lead the development and execution of long-term business strategies aligned with organizational goals." },
      @{ Title="General Manager"; Desc="Manage overall business units or departments, balancing revenue targets, team performance, and customer satisfaction." },
      @{ Title="Entrepreneur / Founder"; Desc="Launch and scale new ventures, from ideation and funding to market entry and growth." },
      @{ Title="HR Manager"; Desc="Oversee recruitment, employee relations, and talent development to build high-performing organizations." },
      @{ Title="Project Manager"; Desc="Plan, execute, and deliver complex projects on time and within scope across multiple business functions." }
    )
    HeroImg = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-bachelor-healthcare-administration.html"
    Title = "Healthcare Administration — Bachelor's Degree | AUS Business School"
    HeroName = "Healthcare Administration"
    Specialization = "Healthcare Administration"
    OverviewH2 = "Prepare for leadership roles in one of the world's fastest-growing industries."
    OverviewP1 = "The Healthcare Administration specialization prepares students to manage and lead healthcare organizations, from hospitals and clinics to public health agencies and health-tech startups. Combining business acumen with healthcare systems knowledge, graduates are ready to improve patient outcomes, optimize operations, and navigate the complex regulatory landscape of modern healthcare."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Healthcare systems and policy","Hospital operations management","Health informatics and data analytics","Financial management in healthcare","Healthcare law and compliance","Quality improvement and patient safety","Strategic planning for health organizations","Leadership in multidisciplinary teams")
    CareerTitle = "Your Future in Healthcare Administration"
    CareerDesc = "The Healthcare Administration specialization prepares students for leadership roles in hospitals, health systems, public health organizations, and health-tech companies. Students gain the operational, financial, and analytical skills needed to improve healthcare delivery."
    Careers = @(
      @{ Title="Healthcare Operations Manager"; Desc="Oversee daily operations of healthcare facilities, ensuring efficiency, compliance, and quality patient care." },
      @{ Title="Hospital Administrator"; Desc="Lead hospital departments or entire facilities, managing staff, budgets, and strategic initiatives." },
      @{ Title="Health Informatics Director"; Desc="Implement and manage health information systems that improve data-driven decision-making in clinical settings." },
      @{ Title="Public Health Administrator"; Desc="Design and manage public health programs and policies that improve community health outcomes." },
      @{ Title="Healthcare Finance Manager"; Desc="Manage financial operations, budgeting, and revenue cycles for healthcare organizations." },
      @{ Title="Clinical Services Manager"; Desc="Coordinate clinical departments, optimize patient flow, and ensure quality standards are maintained." },
      @{ Title="Health Policy Analyst"; Desc="Research and evaluate healthcare policies, advising organizations and governments on regulatory compliance." },
      @{ Title="Long-Term Care Administrator"; Desc="Manage nursing homes, assisted living facilities, and rehabilitation centers with a focus on resident well-being." }
    )
    HeroImg = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-bachelor-human-resource-management.html"
    Title = "Human Resource Management — Bachelor's Degree | AUS Business School"
    HeroName = "Human Resource Management"
    Specialization = "Human Resource Management"
    OverviewH2 = "Prepare for strategic leadership in the people-centred dimension of global business."
    OverviewP1 = "The Human Resource Management specialization equips students with the knowledge and skills to attract, develop, and retain top talent in competitive organizations. Covering recruitment, compensation, employee relations, organizational development, and labor law, graduates are prepared to build engaged, high-performing workforces that drive business success."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Talent acquisition and recruitment strategies","Compensation and benefits design","Employee relations and engagement","Learning and development programs","Organizational design and change management","Labor law and employment legislation","HR analytics and people data","Diversity, equity, and inclusion")
    CareerTitle = "Your Future in Human Resource Management"
    CareerDesc = "The Human Resource Management specialization prepares students for careers across all areas of people management. Students develop skills in recruitment, employee development, compensation, and organizational strategy."
    Careers = @(
      @{ Title="HR Business Partner"; Desc="Align HR strategies with business objectives, partnering with leaders to drive organizational performance." },
      @{ Title="Talent Acquisition Director"; Desc="Lead recruitment strategies and build employer brands to attract top talent globally." },
      @{ Title="Compensation & Benefits Manager"; Desc="Design and manage competitive compensation packages and benefits programs that attract and retain employees." },
      @{ Title="Learning & Development Manager"; Desc="Create and deliver training programs that build employee skills and support career growth." },
      @{ Title="HR Operations Manager"; Desc="Oversee daily HR functions including payroll, benefits administration, and compliance." },
      @{ Title="People & Culture Director"; Desc="Shape organizational culture and lead initiatives that improve employee experience and engagement." },
      @{ Title="Employment Law Specialist"; Desc="Advise organizations on labor law compliance, workplace policies, and employee relations." },
      @{ Title="Chief People Officer"; Desc="Lead enterprise-wide people strategy, reporting directly to the CEO and board of directors." }
    )
    HeroImg = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-bachelor-international-business.html"
    Title = "International Business — Bachelor's Degree | AUS Business School"
    HeroName = "International Business"
    Specialization = "International Business"
    OverviewH2 = "Prepare for leadership roles in the global economy."
    OverviewP1 = "The International Business specialization prepares students to operate across borders, cultures, and markets. Covering global strategy, cross-cultural management, international trade, and foreign market entry, graduates gain the skills to lead in multinational corporations, international organizations, and global startups."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Global strategy and competitive analysis","International trade and regulations","Cross-cultural management","Foreign market entry strategies","Global supply chain management","International marketing","Emerging markets and geopolitics","Multinational financial management")
    CareerTitle = "Your Future in International Business"
    CareerDesc = "The International Business specialization prepares students for careers in global trade, multinational management, and cross-border strategy. Students develop cultural awareness and strategic thinking for international markets."
    Careers = @(
      @{ Title="International Trade Specialist"; Desc="Facilitate cross-border trade, manage export-import operations, and ensure regulatory compliance." },
      @{ Title="Business Development Director"; Desc="Identify and develop new business opportunities across international markets and partnerships." },
      @{ Title="Regional Managing Director"; Desc="Lead business operations across specific geographic regions, balancing local and global strategies." },
      @{ Title="Global Supply Chain Manager"; Desc="Optimize supply chains across multiple countries, managing logistics, procurement, and risk." },
      @{ Title="International Marketing Manager"; Desc="Develop and execute marketing strategies adapted for diverse global markets and cultures." },
      @{ Title="Cross-Cultural Management Consultant"; Desc="Advise organizations on navigating cultural differences and building effective global teams." },
      @{ Title="Foreign Direct Investment Analyst"; Desc="Evaluate international investment opportunities and advise on market entry strategies." },
      @{ Title="Global Account Manager"; Desc="Manage relationships with multinational clients, coordinating services across regions." }
    )
    HeroImg = "https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-bachelor-hospitality-management.html"
    Title = "Hospitality Management — Bachelor's Degree | AUS Business School"
    HeroName = "Hospitality Management"
    Specialization = "Hospitality Management"
    TUDegree = "International Business"
    Duration = "3 Years"
    Structure = "9 Academic Terms (Including Internship)"
    Tuition = "30,000"
    OverviewH2 = "Prepare for international careers in fast-growing service sectors."
    OverviewP1 = "The Hospitality Management specialization prepares students for leadership roles in hotels, resorts, restaurants, event management, and tourism. Combining business fundamentals with hospitality-specific knowledge, graduates are ready to deliver exceptional guest experiences while managing profitable operations in one of the world's most dynamic industries."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Hotel and resort management","Food and beverage operations","Revenue and yield management","Event planning and coordination","Guest relations and service excellence","Hospitality marketing and branding","Financial management in hospitality","Sustainable tourism practices")
    CareerTitle = "Your Future in Hospitality Management"
    CareerDesc = "The Hospitality Management specialization prepares students for careers in hotels, resorts, restaurants, events, and tourism. Students develop operational, financial, and leadership skills for the global hospitality industry."
    Careers = @(
      @{ Title="Front Office Manager"; Desc="Manage front desk operations, guest check-in/out processes, and overall guest satisfaction." },
      @{ Title="Food and Beverage Manager"; Desc="Oversee restaurant and bar operations, menu development, and food service quality standards." },
      @{ Title="Yield and Revenue Manager"; Desc="Optimize pricing strategies and room allocation to maximize revenue across booking channels." },
      @{ Title="Housekeeping Manager"; Desc="Maintain cleanliness and presentation standards across hotel rooms and public areas." },
      @{ Title="Guest Relations Manager"; Desc="Build and maintain guest loyalty programs and handle VIP guest communications." },
      @{ Title="Rooms Division Manager"; Desc="Oversee front office, housekeeping, and reservations departments as part of hotel operations." },
      @{ Title="Events and Banqueting Coordinator"; Desc="Plan and execute conferences, weddings, and corporate events from concept to delivery." },
      @{ Title="Hotel Operations Supervisor"; Desc="Coordinate daily hotel operations across multiple departments to ensure seamless guest experiences." }
    )
    HeroImg = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&auto=format&fit=crop&q=80"
    HasInternshipSection = $true
    InternshipContent = "Internships in Switzerland"
    InternshipDesc = "A paid internship in Switzerland is a core part of the program, providing hands-on experience in world-class hospitality establishments. Students work in five-star hotels, Michelin-starred restaurants, and leading event venues, gaining practical skills that complement their academic learning."
  },
  @{
    File = "aus-bachelor-aviation-management.html"
    Title = "Aviation Management — Bachelor's Degree | AUS Business School"
    HeroName = "Aviation Management"
    Specialization = "Aviation Management"
    TUDegree = "International Business"
    OverviewH2 = "Prepare for a leadership role in the global aviation industry."
    OverviewP1 = "The Aviation Management specialization prepares students for careers in airlines, airports, air cargo, and aviation consulting. As an IATA Authorized Training Center, AUS delivers industry-recognized content that covers airline operations, airport management, aviation safety, and aerospace strategy. Graduates are ready to lead in one of the most complex and globalized industries."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Airline operations and management","Airport business and planning","Aviation safety and regulation","Airline revenue management","Aviation strategy and consulting","Air cargo and logistics","Sustainable aviation and innovation","Aerospace industry trends")
    CareerTitle = "Your Future in Aviation Management"
    CareerDesc = "The Aviation Management specialization prepares students for leadership roles in airlines, airports, aviation consulting, and aerospace. Students develop industry-specific knowledge through IATA-accredited training."
    Careers = @(
      @{ Title="VP of Airline Operations"; Desc="Oversee daily airline operations including flight scheduling, crew management, and on-time performance." },
      @{ Title="Airport Business Director"; Desc="Manage airport commercial activities including retail, parking, and ground handling services." },
      @{ Title="Aviation Safety Executive"; Desc="Develop and implement safety management systems to ensure compliance with international aviation regulations." },
      @{ Title="Airline Revenue Manager"; Desc="Optimize ticket pricing, seat allocation, and ancillary revenue strategies across booking channels." },
      @{ Title="Aviation Strategy Consultant"; Desc="Advise airlines and airports on fleet planning, route expansion, and competitive positioning." },
      @{ Title="Air Cargo & Logistics Manager"; Desc="Manage air freight operations, customs compliance, and global cargo logistics networks." },
      @{ Title="Regulatory Affairs Manager"; Desc="Ensure airline compliance with national and international aviation regulations and standards." },
      @{ Title="Sustainability & Innovation Director"; Desc="Lead initiatives in sustainable aviation fuels, carbon offset programs, and green airport operations." }
    )
    HeroImg = "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-bachelor-integrated-digital-marketing.html"
    Title = "Integrated and Digital Marketing — Bachelor's Degree | AUS Business School"
    HeroName = "Integrated and Digital Marketing"
    Specialization = "Integrated and Digital Marketing"
    OverviewH2 = "Prepare for careers in modern marketing, digital strategy, and brand management."
    OverviewP1 = "The Integrated and Digital Marketing specialization combines traditional marketing principles with cutting-edge digital strategies. Students learn to build brands, create content, analyze data, and execute campaigns across social media, search, email, and emerging platforms. Graduates are prepared to lead marketing in a digital-first world."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Brand strategy and positioning","Digital marketing and social media","Content marketing and storytelling","SEO and search engine marketing","Marketing analytics and data visualization","Email marketing and automation","E-commerce and digital platforms","Consumer behavior and market research")
    CareerTitle = "Your Future in Integrated and Digital Marketing"
    CareerDesc = "The Integrated and Digital Marketing specialization prepares students for careers across the marketing spectrum, from brand management to digital strategy. Students develop creative and analytical skills for modern marketing roles."
    Careers = @(
      @{ Title="Digital Marketing Manager"; Desc="Plan and execute digital marketing campaigns across search, social, email, and display channels." },
      @{ Title="Brand Strategist"; Desc="Develop brand positioning, messaging, and visual identity systems that resonate with target audiences." },
      @{ Title="Content Marketing Director"; Desc="Lead content strategy and production across blogs, video, podcasts, and social media platforms." },
      @{ Title="Social Media Manager"; Desc="Manage brand presence across social platforms, creating engaging content and building communities." },
      @{ Title="SEO / SEM Specialist"; Desc="Optimize website visibility through search engine optimization and paid search campaigns." },
      @{ Title="Marketing Analytics Manager"; Desc="Analyze campaign performance and customer data to optimize marketing spend and ROI." },
      @{ Title="E-Commerce Director"; Desc="Manage online sales channels, optimize conversion funnels, and drive digital revenue growth." },
      @{ Title="Chief Marketing Officer"; Desc="Lead enterprise marketing strategy, brand management, and customer acquisition across all channels." }
    )
    HeroImg = "https://images.unsplash.com/photo-1533750349088-cd871a92f17e?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-bachelor-sports-management-athletic.html"
    Title = "Sports Management — Athletic Administration — Bachelor's Degree | AUS Business School"
    HeroName = "Sports Management — Athletic Administration"
    Specialization = "Sports Management — Athletic Administration"
    OverviewH2 = "Prepare for leadership roles in sports organizations, athletic departments, and sports business."
    OverviewP1 = "The Sports Management — Athletic Administration specialization prepares students to lead sports organizations, manage athletic departments, and oversee sports facilities. Combining business fundamentals with sports industry knowledge, graduates are ready to manage teams, events, and operations in professional and collegiate sports."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Sports organization management","Athletic department administration","Facility planning and management","Event management and logistics","Sports law and compliance","Athletic program development","Budgeting and financial management","Fan engagement and community relations")
    CareerTitle = "Your Future in Sports Management — Athletic Administration"
    CareerDesc = "The Sports Management — Athletic Administration specialization prepares students for leadership roles in sports organizations, athletic departments, and facility management. Students develop operational and strategic skills for the sports industry."
    Careers = @(
      @{ Title="Athletic Director"; Desc="Lead athletic departments, overseeing programs, budgets, staffing, and compliance with regulations." },
      @{ Title="Sports Operations Manager"; Desc="Manage day-to-day operations of sports venues, teams, or athletic organizations." },
      @{ Title="Event Coordinator"; Desc="Plan and execute sports events, tournaments, and competitions from logistics to execution." },
      @{ Title="Sports Marketing Manager"; Desc="Develop marketing strategies that drive ticket sales, sponsorships, and fan engagement." },
      @{ Title="Facility Manager"; Desc="Oversee the maintenance, scheduling, and operations of sports venues and training facilities." },
      @{ Title="Sports Agent"; Desc="Represent athletes in contract negotiations, endorsements, and career management." },
      @{ Title="Compliance Officer"; Desc="Ensure sports organizations comply with league rules, regulations, and ethical standards." },
      @{ Title="Sports Program Director"; Desc="Design and manage sports development programs for youth, collegiate, or professional levels." }
    )
    HeroImg = "https://images.unsplash.com/photo-1461896836934-bd45ba8a0e24?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-bachelor-sports-management-marketing.html"
    Title = "Sports Management — Sports Marketing — Bachelor's Degree | AUS Business School"
    HeroName = "Sports Management — Sports Marketing"
    Specialization = "Sports Management — Sports Marketing"
    OverviewH2 = "Prepare for careers in sports marketing, sponsorship, and brand management."
    OverviewP1 = "The Sports Management — Sports Marketing specialization prepares students for careers in sports marketing, sponsorship, media, and brand partnerships. Students learn to build sports brands, manage fan engagement, negotiate sponsorship deals, and leverage digital platforms to grow audiences. Graduates are ready to lead marketing in professional sports, leagues, and media companies."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Sports marketing and branding","Sponsorship strategy and negotiation","Digital sports content creation","Fan engagement and community building","Sports media and broadcasting","Merchandising and licensing","Sports analytics and data-driven marketing","Social media strategy for sports")
    CareerTitle = "Your Future in Sports Management — Sports Marketing"
    CareerDesc = "The Sports Management — Sports Marketing specialization prepares students for careers in sports marketing, sponsorship, media, and brand management. Students develop creative and analytical skills for the sports industry."
    Careers = @(
      @{ Title="Sports Marketing Director"; Desc="Lead marketing strategies for sports brands, teams, and events across traditional and digital channels." },
      @{ Title="Sponsorship Manager"; Desc="Negotiate and manage sponsorship deals between brands and sports organizations." },
      @{ Title="Digital Sports Content Manager"; Desc="Create and manage digital content strategies across social media, websites, and streaming platforms." },
      @{ Title="Brand Partnership Manager"; Desc="Develop and maintain brand partnerships that drive revenue and audience growth." },
      @{ Title="Sports Media Manager"; Desc="Oversee media relations, press coverage, and broadcast partnerships for sports organizations." },
      @{ Title="Fan Engagement Manager"; Desc="Build and manage fan communities through events, digital platforms, and loyalty programs." },
      @{ Title="Sports PR Specialist"; Desc="Manage public relations, crisis communications, and media strategy for athletes and sports brands." },
      @{ Title="Merchandising Manager"; Desc="Oversee licensed merchandise design, production, and sales for sports brands and teams." }
    )
    HeroImg = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-bachelor-data-analytics-ai.html"
    Title = "Data Analytics and AI for Business — Bachelor's Degree | AUS Business School"
    HeroName = "Data Analytics and AI for Business"
    Specialization = "Data Analytics and AI for Business"
    OverviewH2 = "Prepare for careers at the intersection of data science, AI, and business strategy."
    OverviewP1 = "The Data Analytics and AI for Business specialization equips students with the technical and analytical skills to harness the power of data and artificial intelligence in business contexts. Covering data visualization, machine learning, predictive analytics, and AI strategy, graduates are prepared to turn complex data into actionable business insights."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Data visualization and storytelling","Machine learning fundamentals","Predictive analytics and modeling","AI strategy for business","Business intelligence tools","Database management and SQL","Big data technologies","Ethical AI and data governance")
    CareerTitle = "Your Future in Data Analytics and AI for Business"
    CareerDesc = "The Data Analytics and AI for Business specialization prepares students for careers at the intersection of data science and business strategy. Students develop technical and analytical skills to drive data-informed decisions."
    Careers = @(
      @{ Title="Data Analyst"; Desc="Collect, process, and analyze data to generate insights that support business decision-making." },
      @{ Title="Business Intelligence Manager"; Desc="Design and manage BI systems and dashboards that provide real-time business performance insights." },
      @{ Title="AI Solutions Consultant"; Desc="Advise organizations on AI strategy, implementation, and integration into business processes." },
      @{ Title="Data Science Manager"; Desc="Lead data science teams to develop predictive models and analytical solutions for complex business problems." },
      @{ Title="Analytics Engineer"; Desc="Build and maintain data pipelines and analytical infrastructure that support enterprise analytics." },
      @{ Title="Chief Data Officer"; Desc="Lead enterprise data strategy, governance, and analytics across the organization." },
      @{ Title="Machine Learning Operations Manager"; Desc="Manage ML model deployment, monitoring, and maintenance in production environments." },
      @{ Title="Data Governance Manager"; Desc="Establish and enforce data quality standards, privacy policies, and compliance frameworks." }
    )
    HeroImg = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1800&auto=format&fit=crop&q=80"
  }
)

# Master programs
$masterPrograms = @(
  @{
    File = "aus-master-finance.html"
    Title = "Finance — Master's Degree | AUS Business School"
    HeroBadge = "MSc in International Business Administration"
    HeroName = "Finance"
    Specialization = "Finance"
    Tuition = "25,050"
    Duration = "2 Years"
    Structure = "6 Academic Terms + Capstone"
    Credits = "83 CH | 135 ECTS"
    OverviewH2 = "Master the financial strategies that drive global organizations."
    OverviewP1 = "The Finance specialization provides advanced knowledge in corporate finance, investment analysis, portfolio management, and financial risk. Designed for professionals seeking to lead in banking, asset management, or corporate treasury, it combines rigorous quantitative training with strategic decision-making skills for today's complex financial markets."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Corporate finance and valuation","Investment analysis and portfolio management","Financial risk management","International finance and capital markets","Derivatives and structured products","Mergers and acquisitions","Quantitative finance methods","Ethical finance and ESG investing")
    CareerTitle = "Your Future in Finance"
    CareerDesc = "The Finance specialization prepares students for leadership roles in banking, investment, corporate finance, and financial consulting. Students develop advanced analytical and strategic skills for the global financial industry."
    Careers = @(
      @{ Title="Chief Financial Officer"; Desc="Lead enterprise financial strategy, reporting, risk management, and capital allocation decisions." },
      @{ Title="Senior Investment Analyst"; Desc="Conduct in-depth financial analysis and investment research to support portfolio decisions." },
      @{ Title="Financial Risk Director"; Desc="Identify, measure, and mitigate financial risks across trading, lending, and investment activities." },
      @{ Title="Portfolio Manager"; Desc="Manage investment portfolios, balancing risk and return across asset classes for institutional clients." },
      @{ Title="Corporate Finance Manager"; Desc="Oversee capital structure, budgeting, and financial planning for corporate organizations." },
      @{ Title="Emerging Markets Specialist"; Desc="Analyze and invest in growth opportunities across developing economies and frontier markets." },
      @{ Title="Financial Institutions Manager"; Desc="Manage operations, compliance, and strategy for banks, insurance companies, and fintech firms." },
      @{ Title="Investment Banking Analyst"; Desc="Execute mergers, acquisitions, IPOs, and capital raises for corporate clients." }
    )
    HeroImg = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-master-data-analytics.html"
    Title = "Data Analytics — Master's Degree | AUS Business School"
    HeroBadge = "MSc in International Business Administration"
    HeroName = "Data Analytics"
    Specialization = "Data Analytics"
    Tuition = "25,050"
    Duration = "2 Years"
    Structure = "6 Academic Terms + Capstone"
    Credits = "83 CH | 135 ECTS"
    OverviewH2 = "Turn complex data into strategic business advantage."
    OverviewP1 = "The Data Analytics specialization equips students with advanced analytical skills to transform raw data into actionable business insights. Covering machine learning, statistical modeling, data visualization, and big data technologies, graduates are prepared to lead data-driven decision-making in any industry."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Advanced statistical modeling","Machine learning and AI applications","Data visualization and storytelling","Big data technologies and cloud analytics","Predictive analytics and forecasting","Business intelligence strategy","Data governance and ethics","Quantitative research methods")
    CareerTitle = "Your Future in Data Analytics"
    CareerDesc = "The Data Analytics specialization prepares students for leadership roles in data science, business intelligence, and analytics strategy. Students develop advanced technical and analytical capabilities."
    Careers = @(
      @{ Title="Chief Data Officer"; Desc="Lead enterprise data strategy, governance, and analytics to drive business transformation." },
      @{ Title="Analytics Director"; Desc="Oversee analytics teams and initiatives, translating data insights into strategic business actions." },
      @{ Title="Data Science Lead"; Desc="Lead data science projects, developing predictive models and analytical solutions for complex problems." },
      @{ Title="Business Intelligence Director"; Desc="Design and manage BI platforms and dashboards that provide real-time organizational insights." },
      @{ Title="Machine Learning Manager"; Desc="Develop and deploy machine learning models that automate and optimize business processes." },
      @{ Title="Data Strategy Consultant"; Desc="Advise organizations on data architecture, analytics strategy, and data-driven transformation." },
      @{ Title="Quantitative Analyst"; Desc="Apply advanced mathematical and statistical methods to financial modeling and risk assessment." },
      @{ Title="Data Governance Director"; Desc="Establish enterprise-wide data quality standards, privacy policies, and compliance frameworks." }
    )
    HeroImg = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-master-healthcare-administration.html"
    Title = "Healthcare Administration — Master's Degree | AUS Business School"
    HeroBadge = "MSc in International Business Administration"
    HeroName = "Healthcare Administration"
    Specialization = "Healthcare Administration"
    Tuition = "25,050"
    Duration = "2 Years"
    Structure = "6 Academic Terms + Capstone"
    Credits = "83 CH | 135 ECTS"
    OverviewH2 = "Lead the future of healthcare delivery and management."
    OverviewP1 = "The Healthcare Administration specialization at the master's level prepares senior professionals to lead healthcare organizations through an era of rapid change. Covering health policy, systems thinking, innovation management, and healthcare finance, graduates are ready to drive operational excellence and improve patient outcomes at scale."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Healthcare systems leadership","Health policy and regulation","Healthcare innovation and technology","Strategic planning for health organizations","Healthcare finance and economics","Quality improvement and patient safety","Global health management","Healthcare analytics and informatics")
    CareerTitle = "Your Future in Healthcare Administration"
    CareerDesc = "The Healthcare Administration specialization prepares students for senior leadership roles in hospitals, health systems, public health, and healthcare consulting. Students develop strategic and operational skills for the healthcare industry."
    Careers = @(
      @{ Title="Healthcare CEO"; Desc="Lead healthcare organizations, setting strategic direction and overseeing all operational functions." },
      @{ Title="Hospital Director"; Desc="Manage hospital operations, staff, budgets, and quality initiatives across clinical departments." },
      @{ Title="Health System Administrator"; Desc="Oversee multi-facility health systems, coordinating resources and strategy across locations." },
      @{ Title="Healthcare Consulting Director"; Desc="Advise healthcare organizations on strategy, operations, technology, and regulatory compliance." },
      @{ Title="Public Health Director"; Desc="Lead public health agencies and initiatives that improve community and population health outcomes." },
      @{ Title="Healthcare Innovation Manager"; Desc="Drive adoption of new technologies, processes, and models that improve healthcare delivery." },
      @{ Title="Pharmaceutical Operations Director"; Desc="Manage pharmaceutical manufacturing, distribution, and supply chain operations." },
      @{ Title="Health Policy Director"; Desc="Shape healthcare policy at organizational, national, or international levels through research and advocacy." }
    )
    HeroImg = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-master-human-resource-management.html"
    Title = "Human Resource Management — Master's Degree | AUS Business School"
    HeroBadge = "MSc in International Business Administration"
    HeroName = "Human Resource Management"
    Specialization = "Human Resource Management"
    Tuition = "25,050"
    Duration = "2 Years"
    Structure = "6 Academic Terms + Capstone"
    Credits = "83 CH | 135 ECTS"
    OverviewH2 = "Shape the future of work through strategic people leadership."
    OverviewP1 = "The Human Resource Management specialization at the master's level prepares senior HR professionals to lead talent strategy, organizational development, and people analytics. Covering advanced topics in compensation, employee relations, diversity, and HR transformation, graduates are ready to drive organizational performance through people."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Strategic human resource management","Talent management and succession planning","Organizational development and change","Compensation and benefits strategy","Employee relations and engagement","HR analytics and people data","Diversity, equity, and inclusion","HR technology and digital transformation")
    CareerTitle = "Your Future in Human Resource Management"
    CareerDesc = "The Human Resource Management specialization prepares students for senior leadership roles in talent management, organizational development, and HR strategy. Students develop strategic capabilities for people management."
    Careers = @(
      @{ Title="VP of Human Resources"; Desc="Lead enterprise HR strategy, reporting to the C-suite and driving organizational performance through people." },
      @{ Title="Talent Management Director"; Desc="Design and implement talent acquisition, development, and retention strategies across the organization." },
      @{ Title="Organizational Development Director"; Desc="Lead initiatives that improve organizational effectiveness, culture, and change readiness." },
      @{ Title="Compensation & Benefits Director"; Desc="Design enterprise-wide compensation strategies and benefits programs that attract and retain top talent." },
      @{ Title="Employee Relations Director"; Desc="Manage employee relations, workplace policies, and conflict resolution across the organization." },
      @{ Title="HR Analytics Director"; Desc="Use people data and analytics to drive HR strategy and measure workforce effectiveness." },
      @{ Title="Diversity & Inclusion Director"; Desc="Lead enterprise DEI strategy, programs, and metrics to build a diverse and inclusive workplace." },
      @{ Title="Chief People Officer"; Desc="Lead enterprise people strategy as a C-suite executive, aligning HR with business objectives." }
    )
    HeroImg = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-master-international-business.html"
    Title = "International Business — Master's Degree | AUS Business School"
    HeroBadge = "MSc in International Business Administration"
    HeroName = "International Business"
    Specialization = "International Business"
    Tuition = "25,050"
    Duration = "2 Years"
    Structure = "6 Academic Terms + Capstone"
    Credits = "83 CH | 135 ECTS"
    OverviewH2 = "Lead in the global economy with strategic international expertise."
    OverviewP1 = "The International Business specialization at the master's level prepares professionals to lead in multinational organizations, navigate cross-border operations, and drive global strategy. Covering international trade, cross-border M&A, emerging markets, and global partnerships, graduates are ready to operate at the highest levels of international business."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Global strategy and competitive positioning","Cross-border mergers and acquisitions","International trade and regulations","Emerging markets strategy","Global partnership management","Cross-cultural leadership","International operations management","Geopolitical risk and strategy")
    CareerTitle = "Your Future in International Business"
    CareerDesc = "The International Business specialization prepares students for senior leadership roles in multinational organizations, global strategy, and cross-border operations. Students develop strategic capabilities for international markets."
    Careers = @(
      @{ Title="Global Business Director"; Desc="Lead business operations across multiple countries, balancing local and global strategies." },
      @{ Title="International Strategy Consultant"; Desc="Advise multinational corporations on global strategy, market entry, and competitive positioning." },
      @{ Title="Regional VP"; Desc="Lead regional business operations, managing P&L, teams, and strategy across a geographic area." },
      @{ Title="Cross-Border M&A Specialist"; Desc="Execute international mergers, acquisitions, and divestitures across multiple jurisdictions." },
      @{ Title="International Trade Director"; Desc="Manage global trade operations, customs compliance, and international supply chain relationships." },
      @{ Title="Global Partnership Manager"; Desc="Develop and manage strategic alliances and partnerships with international organizations." },
      @{ Title="Emerging Markets Director"; Desc="Lead business development and market entry strategies in high-growth developing economies." },
      @{ Title="International Operations Director"; Desc="Oversee operations across international offices, ensuring consistency and efficiency." }
    )
    HeroImg = "https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-master-leadership-change.html"
    Title = "Leadership & Change — Master's Degree | AUS Business School"
    HeroBadge = "MSc in International Business Administration"
    HeroName = "Leadership & Change"
    Specialization = "Leadership & Change"
    Tuition = "25,050"
    Duration = "2 Years"
    Structure = "6 Academic Terms + Capstone"
    Credits = "83 CH | 135 ECTS"
    OverviewH2 = "Lead organizational transformation with confidence and clarity."
    OverviewP1 = "The Leadership & Change specialization prepares professionals to lead complex organizational transformations, manage change initiatives, and build adaptive cultures. Covering change management, executive coaching, organizational psychology, and transformation strategy, graduates are ready to guide organizations through periods of disruption and renewal."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Change management frameworks","Organizational development and design","Executive leadership and coaching","Culture and engagement strategy","Transformation consulting","Conflict resolution and negotiation","Team dynamics and performance","Strategic communication for change")
    CareerTitle = "Your Future in Leadership & Change"
    CareerDesc = "The Leadership & Change specialization prepares students for senior roles in organizational development, change management, and transformation leadership. Students develop skills to lead people through change."
    Careers = @(
      @{ Title="Change Management Director"; Desc="Lead organizational change initiatives, managing resistance and driving adoption across all levels." },
      @{ Title="Organizational Development VP"; Desc="Design and implement OD strategies that improve organizational effectiveness and culture." },
      @{ Title="Leadership Development Director"; Desc="Create and deliver leadership programs that build the next generation of organizational leaders." },
      @{ Title="Transformation Consultant"; Desc="Advise organizations on digital transformation, restructuring, and strategic change initiatives." },
      @{ Title="Culture & Engagement Director"; Desc="Shape organizational culture and drive employee engagement through strategic initiatives." },
      @{ Title="Executive Coach"; Desc="Provide one-on-one coaching to senior leaders, developing their effectiveness and impact." },
      @{ Title="HR Transformation Lead"; Desc="Lead HR function transformation, modernizing processes, technology, and operating models." },
      @{ Title="Chief Transformation Officer"; Desc="Lead enterprise-wide transformation initiatives, reporting directly to the CEO and board." }
    )
    HeroImg = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-master-sports-management.html"
    Title = "Sports Management — Master's Degree | AUS Business School"
    HeroBadge = "MSc in International Business Administration"
    HeroName = "Sports Management"
    Specialization = "Sports Management"
    Tuition = "25,050"
    Duration = "2 Years"
    Structure = "6 Academic Terms + Capstone"
    Credits = "83 CH | 135 ECTS"
    OverviewH2 = "Lead at the highest levels of the global sports industry."
    OverviewP1 = "The Sports Management specialization at the master's level prepares professionals to lead sports organizations, manage major sporting events, and drive strategy in professional sports. Covering sports business strategy, facility management, media rights, and international sports governance, graduates are ready for C-suite and director-level roles in the global sports industry."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Sports business strategy","Facility and venue management","Sports media and broadcasting","Event management and operations","Sports law and governance","International sports organizations","Fan engagement and digital media","Sports finance and investment")
    CareerTitle = "Your Future in Sports Management"
    CareerDesc = "The Sports Management specialization prepares students for senior leadership roles in sports organizations, events, media, and consulting. Students develop strategic capabilities for the global sports industry."
    Careers = @(
      @{ Title="Sports Organization CEO"; Desc="Lead sports organizations, setting strategic direction and overseeing all business operations." },
      @{ Title="Athletic Director"; Desc="Lead athletic departments, overseeing programs, budgets, compliance, and strategic growth." },
      @{ Title="Sports Event Director"; Desc="Plan and execute major sporting events, from bid processes to delivery and legacy planning." },
      @{ Title="Sports Facility Director"; Desc="Manage sports venues and facilities, overseeing operations, events, and capital projects." },
      @{ Title="Sports Media Director"; Desc="Lead media strategy, broadcast rights, and content distribution for sports organizations." },
      @{ Title="Sports Sponsorship Director"; Desc="Develop and manage sponsorship portfolios that drive revenue and brand partnerships." },
      @{ Title="Olympic / International Sports Manager"; Desc="Manage operations, logistics, and strategy for international sports organizations and events." },
      @{ Title="Sports Consulting Director"; Desc="Advise sports organizations on strategy, operations, commercial development, and governance." }
    )
    HeroImg = "https://images.unsplash.com/photo-1461896836934-bd45ba8a0e24?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-master-strategic-brand-digital-marketing.html"
    Title = "Strategic Brand & Digital Marketing — Master's Degree | AUS Business School"
    HeroBadge = "MSc in International Business Administration"
    HeroName = "Strategic Brand & Digital Marketing"
    Specialization = "Strategic Brand & Digital Marketing"
    Tuition = "25,050"
    Duration = "2 Years"
    Structure = "6 Academic Terms + Capstone"
    Credits = "83 CH | 135 ECTS"
    OverviewH2 = "Master the art and science of modern brand leadership."
    OverviewP1 = "The Strategic Brand & Digital Marketing specialization at the master's level prepares senior marketing professionals to lead brand strategy, digital transformation, and omnichannel marketing. Covering brand architecture, digital ecosystems, marketing analytics, and creative direction, graduates are ready for CMO and VP-level roles in the world's leading brands."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Brand strategy and architecture","Digital marketing ecosystems","Marketing analytics and attribution","Creative direction and design thinking","Content strategy and storytelling","Social media and influencer marketing","Omnichannel customer experience","Marketing technology and automation")
    CareerTitle = "Your Future in Strategic Brand & Digital Marketing"
    CareerDesc = "The Strategic Brand & Digital Marketing specialization prepares students for senior leadership roles in brand management, digital marketing, and creative direction. Students develop strategic and creative capabilities."
    Careers = @(
      @{ Title="Chief Marketing Officer"; Desc="Lead enterprise marketing strategy, brand management, and customer acquisition across all channels." },
      @{ Title="Brand Director"; Desc="Lead brand strategy, positioning, and architecture for global brands across markets." },
      @{ Title="Digital Marketing VP"; Desc="Oversee digital marketing strategy, channels, and technology across the organization." },
      @{ Title="Creative Director"; Desc="Lead creative vision, design direction, and brand expression across all touchpoints." },
      @{ Title="Content Strategy Director"; Desc="Develop and manage content strategies that drive engagement, authority, and conversion." },
      @{ Title="Social Media Director"; Desc="Lead social media strategy, community management, and influencer partnerships." },
      @{ Title="Marketing Analytics Director"; Desc="Use data and analytics to optimize marketing performance and drive ROI across channels." },
      @{ Title="E-Commerce Director"; Desc="Lead online sales strategy, digital storefronts, and conversion optimization." }
    )
    HeroImg = "https://images.unsplash.com/photo-1533750349088-cd871a92f17e?w=1800&auto=format&fit=crop&q=80"
  },
  @{
    File = "aus-master-aviation-management.html"
    Title = "Aviation Management — Master's Degree | AUS Business School"
    HeroBadge = "MSc in International Business Administration"
    HeroName = "Aviation Management"
    Specialization = "Aviation Management"
    Tuition = "25,050"
    Duration = "2 Years"
    Structure = "6 Academic Terms + Capstone"
    Credits = "83 CH | 135 ECTS"
    OverviewH2 = "Lead the future of global aviation at the executive level."
    OverviewP1 = "The Aviation Management specialization at the master's level prepares senior professionals for executive roles in airlines, airports, and aviation consulting. Covering airline strategy, airport planning, aviation safety management, and aerospace innovation, graduates are ready to lead in one of the world's most complex and globalized industries."
    OverviewP2 = "The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland."
    OverviewList = @("Airline strategy and operations","Airport planning and management","Aviation safety and regulatory compliance","Aviation consulting and advisory","Aerospace innovation and sustainability","Air cargo and logistics management","Aviation finance and investment","International aviation law")
    CareerTitle = "Your Future in Aviation Management"
    CareerDesc = "The Aviation Management specialization prepares students for executive-level roles in airlines, airports, aviation consulting, and aerospace. Students develop strategic leadership skills for the global aviation industry."
    Careers = @(
      @{ Title="Airline CEO"; Desc="Lead airlines, setting strategic direction, fleet planning, route network, and commercial strategy." },
      @{ Title="Airport Director"; Desc="Manage airport operations, commercial activities, infrastructure development, and stakeholder relations." },
      @{ Title="Aviation Consulting Director"; Desc="Advise airlines, airports, and governments on strategy, operations, and regulatory matters." },
      @{ Title="Aviation Safety Director"; Desc="Lead safety management systems and ensure compliance with international aviation safety standards." },
      @{ Title="Airline Strategy Director"; Desc="Develop and execute long-term strategic plans for airlines in competitive global markets." },
      @{ Title="Aviation Innovation Director"; Desc="Drive adoption of new technologies, sustainable practices, and innovative business models in aviation." },
      @{ Title="Air Cargo Director"; Desc="Manage global air cargo operations, freight logistics, and supply chain partnerships." },
      @{ Title="Aviation Regulatory Director"; Desc="Navigate international aviation regulations and represent organizations in regulatory affairs." }
    )
    HeroImg = "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1800&auto=format&fit=crop&q=80"
  }
)

# Helper function to build career cards
function Build-CareerCards {
  param($careers)
  $cards = ""
  $revealClasses = @("","d1","d2","d3","","d1","d2","d3")
  for ($i = 0; $i -lt $careers.Count; $i++) {
    $c = $careers[$i]
    $rc = $revealClasses[$i]
    $svgIndex = $i % 4
    $svgs = @(
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
      '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
      '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'
    )
    $svg = $svgs[$svgIndex]
    $cards += @"

      <div class="career-card reveal $($rc)" style="padding:clamp(20px,2.5vw,28px);border-radius:4px;background:var(--navy);color:var(--white);">
        <div style="width:40px;height:40px;background:rgba(255,255,255,.1);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sky)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">$($svg)</svg>
        </div>
        <h3 style="font-family:var(--font-serif);font-style:italic;font-size:16px;margin:0 0 8px;">$($c.Title)</h3>
        <p style="font-size:13px;line-height:1.6;color:rgba(255,255,255,.65);">$($c.Desc)</p>
      </div>
"@
  }
  return $cards
}

# Helper function to build overview list
function Build-OverviewList {
  param($items)
  $list = ""
  foreach ($item in $items) {
    $list += "`n            <li><svg width=`"16`" height=`"16`" viewBox=`"0 0 24 24`" fill=`"none`" stroke=`"var(--sky)`" stroke-width=`"2`" stroke-linecap=`"round`" stroke-linejoin=`"round`"><path d=`"M22 11.08V12a10 10 0 1 1-5.93-9.14`"/><polyline points=`"22 4 12 14.01 9 11.01`"/></svg> $($item)</li>"
  }
  return $list
}

# Generate bachelor pages
foreach ($prog in $bachelorPrograms) {
  $content = $template
  $content = $content -replace '<title>Accounting — Bachelor''s Degree \| AUS Business School</title>', "<title>$($prog.Title)</title>"
  $content = $content -replace '<h1 class="reveal d1" style="font-size:clamp\(56px,10vw,120px\);line-height:.95;">Accounting</h1>', "<h1 class=`"reveal d1`" style=`"font-size:clamp(56px,10vw,120px);line-height:.95;`">$($prog.HeroName)</h1>"
  
  # Hero background image
  $content = $content -replace 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40\?w=1800&auto=format&fit=crop&q=80', $prog.HeroImg
  
  # Breadcrumb
  $content = $content -replace 'Accounting</div>\s*</div>\s*</section>\s*<!-- STATS BAR', "$($prog.HeroName)</div>`n  </div>`n</section>`n`n<!-- STATS BAR"
  
  # Quick facts specialization
  $content = $content -replace '<div style="font-weight:700;font-size:15px;color:var(--crimson\);line-height:1.4;">Accounting</div>', "<div style=`"font-weight:700;font-size:15px;color:var(--crimson);line-height:1.4;`">$($prog.Specialization)</div>"
  
  # Overview heading
  $content = $content -replace '<h2>A traditional accounting pathway, <em>built for the modern workplace</em>.</h2>', "<h2>$($prog.OverviewH2)</h2>"
  
  # Overview paragraphs
  $overviewP1 = $prog.OverviewP1 -replace '"', '\"'
  $overviewP2 = $prog.OverviewP2 -replace '"', '\"'
  $content = $content -replace '<p>The Accounting specialization gives students.*?</p>', "<p>$($prog.OverviewP1)</p>"
  $content = $content -replace '<p style="margin-top:12px;">The double degree allows.*?</p>', "<p style=`"margin-top:12px;`">$($prog.OverviewP2)</p>"
  
  # Overview list
  $newList = Build-OverviewList -items $prog.OverviewList
  $oldListPattern = '(?s)<ul class="overview-list" style="margin-top:16px;">.*?</ul>'
  $content = $content -replace $oldListPattern, "<ul class=`"overview-list`" style=`"margin-top:16px;`">$newList`n          </ul>"
  
  # Career title
  $content = $content -replace '<h2 class="reveal d1"[^>]*>Your Future in Accounting</h2>', "<h2 class=`"reveal d1`" style=`"font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:clamp(28px,3.5vw,44px);color:var(--navy);margin-top:12px;`">$($prog.CareerTitle)</h2>"
  
  # Career description
  $content = $content -replace '<p class="reveal d2"[^>]*>The Accounting Specialization prepares.*?</p>', "<p class=`"reveal d2`" style=`"font-size:clamp(14px,1.1vw,16px);line-height:1.75;color:var(--ink-soft);max-width:60ch;margin-top:12px;margin-bottom:clamp(24px,3vw,36px);`">$($prog.CareerDesc)</p>"
  
  # Career cards
  $newCareerCards = Build-CareerCards -careers $prog.Careers
  $careerCardsPattern = '(?s)<div style="display:grid;grid-template-columns:repeat\(4,1fr\).*?</section>\s*<!-- ADMISSIONS'
  $content = $content -replace $careerCardsPattern, "<div style=`"display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(14px,1.6vw,20px);`">$newCareerCards`n    </div>`n  </div>`n</section>`n`n<!-- ADMISSIONS"
  
  # Testimonial
  $content = $content -replace '"The Accounting specialization gave me the technical skills.*?"', "`"The $($prog.Specialization) specialization gave me the technical skills and confidence to succeed in a competitive industry. The dual degree with Tiffin University opened doors I never expected.`""
  $content = $content -replace 'BSc in Business Administration — Accounting', "BSc in Business Administration — $($prog.Specialization)"
  
  # Handle special hospitality sections
  if ($prog.HasInternshipSection) {
    # Update tuition to 30,000
    $content = $content -replace '28,000 CHF', "$($prog.Tuition) CHF"
    # Update structure
    $content = $content -replace '9 Academic Terms', $prog.Structure
  }
  
  $content | Set-Content -Path "C:\Users\MC\Desktop\test\$($prog.File)" -Encoding UTF8
  Write-Host "Created: $($prog.File)"
}

# Generate master pages
foreach ($prog in $masterPrograms) {
  $content = $template
  
  # Update title
  $content = $content -replace '<title>Accounting — Bachelor''s Degree \| AUS Business School</title>', "<title>$($prog.Title)</title>"
  
  # Update hero badge
  $content = $content -replace 'BSc in Business Administration', $prog.HeroBadge
  
  # Update hero h1
  $content = $content -replace '<h1 class="reveal d1" style="font-size:clamp\(56px,10vw,120px\);line-height:.95;">Accounting</h1>', "<h1 class=`"reveal d1`" style=`"font-size:clamp(56px,10vw,120px);line-height:.95;`">$($prog.HeroName)</h1>"
  
  # Hero background image
  $content = $content -replace 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40\?w=1800&auto=format&fit=crop&q=80', $prog.HeroImg
  
  # Breadcrumb
  $content = $content -replace 'Accounting</div>\s*</div>\s*</section>\s*<!-- STATS BAR', "$($prog.HeroName)</div>`n  </div>`n</section>`n`n<!-- STATS BAR"
  
  # Quick facts - TU Degree for masters
  $content = $content -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">Bachelor of Business Administration</div>', "<div style=`"font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;`">Master of Business Administration</div>"
  
  # Quick facts specialization
  $content = $content -replace '<div style="font-weight:700;font-size:15px;color:var(--crimson\);line-height:1.4;">Accounting</div>', "<div style=`"font-weight:700;font-size:15px;color:var(--crimson);line-height:1.4;`">$($prog.Specialization)</div>"
  
  # Quick facts - Duration
  $content = $content -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">3 Years</div>', "<div style=`"font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;`">$($prog.Duration)</div>"
  
  # Quick facts - Structure
  $content = $content -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">9 Academic Terms</div>', "<div style=`"font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;`">$($prog.Structure)</div>"
  
  # Quick facts - Credits
  $content = $content -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">135 CH \| 225 ECTS</div>', "<div style=`"font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;`">$($prog.Credits)</div>"
  
  # Overview heading
  $content = $content -replace '<h2>A traditional accounting pathway, <em>built for the modern workplace</em>.</h2>', "<h2>$($prog.OverviewH2)</h2>"
  
  # Overview paragraphs
  $content = $content -replace '<p>The Accounting specialization gives students.*?</p>', "<p>$($prog.OverviewP1)</p>"
  $content = $content -replace '<p style="margin-top:12px;">The double degree allows.*?</p>', "<p style=`"margin-top:12px;`">$($prog.OverviewP2)</p>"
  
  # Overview list
  $newList = Build-OverviewList -items $prog.OverviewList
  $oldListPattern = '(?s)<ul class="overview-list" style="margin-top:16px;">.*?</ul>'
  $content = $content -replace $oldListPattern, "<ul class=`"overview-list`" style=`"margin-top:16px;`">$newList`n          </ul>"
  
  # Curriculum heading
  $content = $content -replace 'Three years · nine academic terms · 135 CH \| 225 ECTS\.', "Two years · six academic terms plus capstone · $($prog.Credits)."
  
  # Career title
  $content = $content -replace '<h2 class="reveal d1"[^>]*>Your Future in Accounting</h2>', "<h2 class=`"reveal d1`" style=`"font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:clamp(28px,3.5vw,44px);color:var(--navy);margin-top:12px;`">$($prog.CareerTitle)</h2>"
  
  # Career description
  $content = $content -replace '<p class="reveal d2"[^>]*>The Accounting Specialization prepares.*?</p>', "<p class=`"reveal d2`" style=`"font-size:clamp(14px,1.1vw,16px);line-height:1.75;color:var(--ink-soft);max-width:60ch;margin-top:12px;margin-bottom:clamp(24px,3vw,36px);`">$($prog.CareerDesc)</p>"
  
  # Career cards
  $newCareerCards = Build-CareerCards -careers $prog.Careers
  $careerCardsPattern = '(?s)<div style="display:grid;grid-template-columns:repeat\(4,1fr\).*?</section>\s*<!-- ADMISSIONS'
  $content = $content -replace $careerCardsPattern, "<div style=`"display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(14px,1.6vw,20px);`">$newCareerCards`n    </div>`n  </div>`n</section>`n`n<!-- ADMISSIONS"
  
  # Admissions IELTS for masters
  $content = $content -replace 'IELTS Overall 5.5 with no single element below 4.5', 'IELTS Overall 6.0 with no single element below 5.5'
  
  # Tuition
  $content = $content -replace '28,000 CHF', "$($prog.Tuition) CHF"
  
  # Testimonial
  $content = $content -replace '"The Accounting specialization gave me the technical skills.*?"', "`"The $($prog.Specialization) specialization gave me the advanced skills and strategic perspective to lead in a competitive global market. The dual degree with Tiffin University was a game-changer for my career.`""
  $content = $content -replace 'BSc in Business Administration — Accounting', "MSc in International Business Administration — $($prog.Specialization)"
  
  $content | Set-Content -Path "C:\Users\MC\Desktop\test\$($prog.File)" -Encoding UTF8
  Write-Host "Created: $($prog.File)"
}

# DBA page
$dbaContent = $template
$dbaContent = $dbaContent -replace '<title>Accounting — Bachelor''s Degree \| AUS Business School</title>', '<title>Doctorate in Business Administration | AUS Business School</title>'
$dbaContent = $dbaContent -replace 'BSc in Business Administration', 'Doctorate in Business Administration'
$dbaContent = $dbaContent -replace '<h1 class="reveal d1" style="font-size:clamp\(56px,10vw,120px\);line-height:.95;">Accounting</h1>', '<h1 class="reveal d1" style="font-size:clamp(56px,10vw,120px);line-height:.95;">Doctorate in Business Administration</h1>'
$dbaContent = $dbaContent -replace 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40\?w=1800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1800&auto=format&fit=crop&q=80'
$dbaContent = $dbaContent -replace 'Accounting</div>\s*</div>\s*</section>\s*<!-- STATS BAR', 'Doctorate in Business Administration</div>`n  </div>`n</section>`n`n<!-- STATS BAR'
$dbaContent = $dbaContent -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">Bachelor of Business Administration</div>', '<div style="font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;">Doctor of Business Administration</div>'
$dbaContent = $dbaContent -replace '<div style="font-weight:700;font-size:15px;color:var(--crimson\);line-height:1.4;">Accounting</div>', '<div style="font-weight:700;font-size:15px;color:var(--crimson);line-height:1.4;">Business Administration</div>'
$dbaContent = $dbaContent -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">3 Years</div>', '<div style="font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;">3 Years (Part-Time)</div>'
$dbaContent = $dbaContent -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">9 Academic Terms</div>', '<div style="font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;">Part-Time Structure</div>'
$dbaContent = $dbaContent -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">135 CH \| 225 ECTS</div>', '<div style="font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;">120 CH | 240 ECTS</div>'
$dbaContent = $dbaContent -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">Full-Time</div>', '<div style="font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;">Part-Time</div>'

$dbaOverviewList = Build-OverviewList -items @("Executive leadership and strategic thinking","Advanced business research methodologies","Organizational transformation and innovation","Industry-specific expertise development","Doctoral dissertation and original research","Global business governance","Ethical leadership and corporate responsibility","Knowledge transfer and thought leadership")
$dbaContent = $dbaContent -replace '<h2>A traditional accounting pathway, <em>built for the modern workplace</em>.</h2>', '<h2>The highest level of professional business education — for senior executives and leaders.</h2>'
$dbaContent = $dbaContent -replace '<p>The Accounting specialization gives students.*?</p>', '<p>The Doctorate in Business Administration (DBA) is the highest level of professional business education. Designed for senior executives, entrepreneurs, and leaders with extensive professional experience, the DBA combines rigorous academic research with real-world application. Students conduct original research that addresses complex business challenges, contributing new knowledge to the field of management.</p>'
$dbaContent = $dbaContent -replace '<p style="margin-top:12px;">The double degree allows.*?</p>', '<p style="margin-top:12px;">The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.</p>'

$oldListPattern = '(?s)<ul class="overview-list" style="margin-top:16px;">.*?</ul>'
$dbaContent = $dbaContent -replace $oldListPattern, "<ul class=`"overview-list`" style=`"margin-top:16px;`">$dbaOverviewList`n          </ul>"

$dbaCareers = Build-CareerCards -careers @(
  @{ Title="C-Suite Executive"; Desc="Lead organizations at the highest level, driving strategy, growth, and stakeholder value." },
  @{ Title="Business Consultant"; Desc="Advise Fortune 500 companies and governments on complex strategic and operational challenges." },
  @{ Title="Academic Researcher"; Desc="Conduct original research and publish in leading academic journals, shaping business theory." },
  @{ Title="Board Member"; Desc="Serve on corporate or nonprofit boards, providing governance and strategic oversight." },
  @{ Title="Entrepreneur"; Desc="Found and scale ventures based on original research and deep industry expertise." },
  @{ Title="Industry Expert"; Desc="Become a recognized thought leader through publications, speaking, and consulting." },
  @{ Title="Policy Advisor"; Desc="Advise governments and international organizations on business and economic policy." },
  @{ Title="Executive Educator"; Desc="Teach and develop MBA and executive education programs at leading business schools." }
)
$dbaContent = $dbaContent -replace '<h2 class="reveal d1"[^>]*>Your Future in Accounting</h2>', '<h2 class="reveal d1" style="font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:clamp(28px,3.5vw,44px);color:var(--navy);margin-top:12px;">Your Future with a DBA</h2>'
$dbaContent = $dbaContent -replace '<p class="reveal d2"[^>]*>The Accounting Specialization prepares.*?</p>', '<p class="reveal d2" style="font-size:clamp(14px,1.1vw,16px);line-height:1.75;color:var(--ink-soft);max-width:60ch;margin-top:12px;margin-bottom:clamp(24px,3vw,36px);">The DBA prepares graduates for the highest levels of professional and academic leadership, combining executive expertise with original research capabilities.</p>'

$careerCardsPattern = '(?s)<div style="display:grid;grid-template-columns:repeat\(4,1fr\).*?</section>\s*<!-- ADMISSIONS'
$dbaContent = $dbaContent -replace $careerCardsPattern, "<div style=`"display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(14px,1.6vw,20px);`">$dbaCareers`n    </div>`n  </div>`n</section>`n`n<!-- ADMISSIONS"

$dbaContent = $dbaContent -replace '28,000 CHF', '35,000 CHF'
$dbaContent = $dbaContent -replace '"The Accounting specialization gave me the technical skills.*?"', '"The DBA transformed my approach to leadership. The rigorous research and global perspective I gained at AUS have fundamentally changed how I lead and innovate in my organization."'
$dbaContent = $dbaContent -replace 'BSc in Business Administration — Accounting', 'DBA — Business Administration'
$dbaContent = $dbaContent -replace 'Three years · nine academic terms · 135 CH | 225 ECTS.', 'Three years · part-time structure · 120 CH | 240 ECTS.'
$dbaContent = $dbaContent -replace 'IELTS Overall 5.5 with no single element below 4.5', 'IELTS Overall 6.5 with no single element below 6.0'

$dbaContent | Set-Content -Path "C:\Users\MC\Desktop\test\aus-dba.html" -Encoding UTF8
Write-Host "Created: aus-dba.html"

# Federal Diploma page
$fdContent = $template
$fdContent = $fdContent -replace '<title>Accounting — Bachelor''s Degree \| AUS Business School</title>', '<title>Swiss Federal Diploma in Business Administration | AUS Business School</title>'
$fdContent = $fdContent -replace 'BSc in Business Administration', 'Swiss Federal Diploma'
$fdContent = $fdContent -replace '<h1 class="reveal d1" style="font-size:clamp\(56px,10vw,120px\);line-height:.95;">Accounting</h1>', '<h1 class="reveal d1" style="font-size:clamp(56px,10vw,120px);line-height:.95;">Swiss Federal Diploma in Business Administration</h1>'
$fdContent = $fdContent -replace 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40\?w=1800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1800&auto=format&fit=crop&q=80'
$fdContent = $fdContent -replace 'Accounting</div>\s*</div>\s*</section>\s*<!-- STATS BAR', 'Swiss Federal Diploma in Business Administration</div>`n  </div>`n</section>`n`n<!-- STATS BAR'
$fdContent = $fdContent -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">Bachelor of Business Administration</div>', '<div style="font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;">Swiss Federal Diploma</div>'
$fdContent = $fdContent -replace '<div style="font-weight:700;font-size:15px;color:var(--crimson\);line-height:1.4;">Accounting</div>', '<div style="font-weight:700;font-size:15px;color:var(--crimson);line-height:1.4;">Business Administration</div>'
$fdContent = $fdContent -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">3 Years</div>', '<div style="font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;">2 Years (Part-Time)</div>'
$fdContent = $fdContent -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">9 Academic Terms</div>', '<div style="font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;">4 Academic Terms</div>'
$fdContent = $fdContent -replace '<div style="font-weight:700;font-size:15px;color:var(--navy\);line-height:1.4;">135 CH \| 225 ECTS</div>', '<div style="font-weight:700;font-size:15px;color:var(--navy);line-height:1.4;">60 CH | 120 ECTS</div>'

$fdOverviewList = Build-OverviewList -items @("Swiss-recognized professional qualification","Part-time study for working professionals","Business management fundamentals","Strategic leadership and operations","Financial management and accounting","Marketing and business development","Organizational behavior and HR","Practical capstone project")
$fdContent = $fdContent -replace '<h2>A traditional accounting pathway, <em>built for the modern workplace</em>.</h2>', '<h2>A Swiss-recognized professional qualification — for experienced professionals.</h2>'
$fdContent = $fdContent -replace '<p>The Accounting specialization gives students.*?</p>', '<p>The Swiss Federal Diploma in Business Administration provides a nationally recognized professional qualification that validates advanced business competencies. Designed for experienced professionals seeking formal recognition of their expertise, the program combines rigorous academic content with practical application, ensuring graduates meet the highest Swiss professional standards.</p>'
$fdContent = $fdContent -replace '<p style="margin-top:12px;">The double degree allows.*?</p>', '<p style="margin-top:12px;">The program is recognized by Swiss authorities and provides a pathway to senior management roles in Swiss and international organizations.</p>'

$oldListPattern = '(?s)<ul class="overview-list" style="margin-top:16px;">.*?</ul>'
$fdContent = $fdContent -replace $oldListPattern, "<ul class=`"overview-list`" style=`"margin-top:16px;`">$fdOverviewList`n          </ul>"

$fdCareers = Build-CareerCards -careers @(
  @{ Title="Senior Manager"; Desc="Lead teams and departments with formal recognition of advanced business competencies." },
  @{ Title="Business Director"; Desc="Oversee business units or functions with the authority of a Swiss-recognized qualification." },
  @{ Title="Operations Director"; Desc="Manage complex operations with the strategic and operational skills validated by the diploma." },
  @{ Title="Management Consultant"; Desc="Advise organizations with a qualification recognized across Swiss and European markets." },
  @{ Title="Project Leader"; Desc="Lead major projects and initiatives with formal professional recognition." },
  @{ Title="Department Head"; Desc="Manage departments in multinational organizations with Swiss-recognized credentials." },
  @{ Title="Entrepreneur"; Desc="Launch and manage businesses with a formal professional qualification from Switzerland." },
  @{ Title="Industry Specialist"; Desc="Specialize in specific sectors with a qualification valued by Swiss employers." }
)
$fdContent = $fdContent -replace '<h2 class="reveal d1"[^>]*>Your Future in Accounting</h2>', '<h2 class="reveal d1" style="font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:clamp(28px,3.5vw,44px);color:var(--navy);margin-top:12px;">Your Future with a Swiss Federal Diploma</h2>'
$fdContent = $fdContent -replace '<p class="reveal d2"[^>]*>The Accounting Specialization prepares.*?</p>', '<p class="reveal d2" style="font-size:clamp(14px,1.1vw,16px);line-height:1.75;color:var(--ink-soft);max-width:60ch;margin-top:12px;margin-bottom:clamp(24px,3vw,36px);">The Swiss Federal Diploma prepares experienced professionals for senior management roles with a nationally recognized qualification.</p>'

$careerCardsPattern = '(?s)<div style="display:grid;grid-template-columns:repeat\(4,1fr\).*?</section>\s*<!-- ADMISSIONS'
$fdContent = $fdContent -replace $careerCardsPattern, "<div style=`"display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(14px,1.6vw,20px);`">$fdCareers`n    </div>`n  </div>`n</section>`n`n<!-- ADMISSIONS"

$fdContent = $fdContent -replace '28,000 CHF', '18,000 CHF'
$fdContent = $fdContent -replace '"The Accounting specialization gave me the technical skills.*?"', '"The Swiss Federal Diploma gave me the formal recognition I needed to advance into senior management. The program combined practical relevance with academic rigor."'
$fdContent = $fdContent -replace 'BSc in Business Administration — Accounting', 'Swiss Federal Diploma — Business Administration'
$fdContent = $fdContent -replace 'Three years · nine academic terms · 135 CH | 225 ECTS.', 'Two years · four academic terms · 60 CH | 120 ECTS.'
$fdContent = $fdContent -replace 'IELTS Overall 5.5 with no single element below 4.5', 'IELTS Overall 5.5 with no single element below 4.5'

$fdContent | Set-Content -Path "C:\Users\MC\Desktop\test\aus-federal-diploma.html" -Encoding UTF8
Write-Host "Created: aus-federal-diploma.html"

Write-Host "`nAll 21 pages created successfully!"
